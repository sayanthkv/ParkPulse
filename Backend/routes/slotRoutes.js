const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/authMiddleware');

// 1. GET /api/slots?locationId=... -> Fetch slots and overlay active bookings
router.get('/', async (req, res) => {
  try {
    const { locationId } = req.query;

    if (!locationId) {
      return res.status(400).json({ message: 'locationId is required to fetch slots.' });
    }

    const slots = await Slot.find({ locationId }).sort({ slotNumber: 1 }).lean();

    const activeBookings = await Booking.find({
      status: { $in: ['BOOKED', 'ACTIVE', 'Booked'] },
      endTime: { $gt: new Date() }
    }).lean();

    const bookedSlotIds = new Set(
      activeBookings.filter((b) => b.slotId).map((b) => b.slotId.toString())
    );

    const updatedSlots = slots.map((slot) => ({
      ...slot,
      status: bookedSlotIds.has(slot._id.toString()) ? 'RESERVED' : slot.status
    }));

    return res.status(200).json(updatedSlots);
  } catch (err) {
    console.error('Error fetching slots:', err);
    return res.status(500).json({ message: 'Error fetching slots.', error: err.message });
  }
});

// 2. GET /api/slots/my-bookings -> Fetch driver passes
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User authorization required.' });
    }

    const bookings = await Booking.find({
      $or: [{ user: userId }, { userId: userId }]
    })
      .populate({
        path: 'slotId',
        populate: { path: 'locationId' }
      })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching my bookings:', error);
    return res.status(500).json({ 
      message: 'Error fetching user bookings.', 
      error: error.message 
    });
  }
});

// 3. POST /api/slots/book -> Reserve parking bay
router.post('/book', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user?.userId || req.body.userId;
    const vehicleNumber = req.body.vehicleNumber || req.user?.vehicleNumber || 'KL-13-AB-1234';

    if (!userId) {
      return res.status(401).json({ message: 'User authorization required.' });
    }

    const {
      slotId,
      locationId,
      locationName,
      floorNumber,
      bayNumber,
      durationHours,
      totalAmount,
      bookingDate,
    } = req.body;

    // --- Custom Location, Floor & Bay Booking Flow ---
    if (locationId && bayNumber) {
      const parsedFloor = Number(floorNumber || 1);
      const parsedBay = Number(bayNumber);

      const existingBooking = await Booking.findOne({
        locationId,
        floorNumber: parsedFloor,
        bayNumber: parsedBay,
        status: { $in: ['BOOKED', 'Booked', 'ACTIVE'] },
      });

      if (existingBooking) {
        return res.status(400).json({
          message: `Bay B-${parsedBay} on Floor ${parsedFloor} is already booked!`,
        });
      }

      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 8 * 60 * 60 * 1000); // 8 hours valid duration

      const newBooking = new Booking({
        user: userId,
        userId: userId,
        locationId,
        locationName: locationName || 'Kannur Parking Hub',
        floorNumber: parsedFloor,
        bayNumber: parsedBay,
        vehicleNumber: String(vehicleNumber).toUpperCase(),
        bookingDate: bookingDate || new Date().toISOString().split('T')[0],
        startTime: startTime,
        endTime: endTime,
        totalAmount: totalAmount || 100,
        baseFee: totalAmount || 100,
        status: 'Booked',
      });

      await newBooking.save();

      return res.status(201).json({
        message: `Bay B-${parsedBay} reserved successfully!`,
        booking: newBooking,
      });
    }

    // --- Legacy Slot ID Booking Flow ---
    if (!slotId) {
      return res.status(400).json({ message: 'Slot ID or Location/Bay details are required.' });
    }

    const slot = await Slot.findById(slotId).populate('locationId');
    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found.' });
    }

    if (slot.status !== 'AVAILABLE') {
      return res.status(400).json({ message: 'Selected slot is no longer available.' });
    }

    const hoursNum = parseInt(durationHours, 10);
    const validHours = !isNaN(hoursNum) && hoursNum > 0 ? hoursNum : 1;

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + validHours * 60 * 60 * 1000);

    const ratePerHour = slot.locationId?.baseRate || 25;
    const baseFee = ratePerHour * validHours;

    const newBooking = new Booking({
      user: userId,
      userId,
      slotId: slot._id,
      locationId: slot.locationId?._id || slot.locationId,
      locationName: slot.locationId?.name || 'Kannur Parking Hub',
      bayNumber: slot.slotNumber || 1,
      vehicleNumber: String(vehicleNumber).toUpperCase(),
      startTime,
      endTime,
      baseFee,
      totalAmount: baseFee,
      penaltyFee: 0,
      status: 'BOOKED',
      reminderSent: false,
    });

    await newBooking.save();

    slot.status = 'RESERVED';
    await slot.save();

    return res.status(201).json({
      message: `Slot ${slot.slotNumber} reserved successfully!`,
      booking: newBooking,
    });
  } catch (error) {
    console.error('Error in /book:', error);
    return res.status(500).json({ message: 'Error creating booking.', error: error.message });
  }
});

module.exports = router;