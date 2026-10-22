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

    // Check active non-expired bookings to reflect true slot status
    const activeBookings = await Booking.find({
      status: { $in: ['BOOKED', 'ACTIVE'] },
      endTime: { $gt: new Date() }
    }).lean();

    const bookedSlotIds = new Set(activeBookings.map((b) => b.slotId.toString()));

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

// 2. GET /api/slots/my-bookings -> Fetch driver passes with NESTED populate
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User authorization required.' });
    }

    // 🟢 Nested populate: slotId -> locationId
    const bookings = await Booking.find({ userId })
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
    const { slotId, durationHours } = req.body;

    if (!slotId) {
      return res.status(400).json({ message: 'Slot ID is required.' });
    }

    const slot = await Slot.findById(slotId).populate('locationId');
    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found.' });
    }

    if (slot.status !== 'AVAILABLE') {
      return res.status(400).json({ message: 'Selected slot is no longer available.' });
    }

    // Safe duration calculation
    const hoursNum = parseInt(durationHours, 10);
    const validHours = (!isNaN(hoursNum) && hoursNum > 0) ? hoursNum : 1;

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + validHours * 60 * 60 * 1000);

    const userId = req.user?._id || req.user?.id || req.user?.userId || req.body.userId;
    const vehicleNumber = req.user?.vehicleNumber || req.body.vehicleNumber || 'KL-13-AB-1234';

    if (!userId) {
      return res.status(401).json({ message: 'User authorization required.' });
    }

    const ratePerHour = slot.locationId?.baseRate || 25;
    const baseFee = ratePerHour * validHours;

    const newBooking = new Booking({
      userId,
      slotId: slot._id,
      vehicleNumber: String(vehicleNumber).toUpperCase(),
      startTime,
      endTime,
      baseFee,
      penaltyFee: 0,
      status: 'BOOKED',
      reminderSent: false
    });

    await newBooking.save();

    // Reserve slot
    slot.status = 'RESERVED';
    await slot.save();

    return res.status(201).json({
      message: `Slot ${slot.slotNumber} reserved successfully!`,
      booking: newBooking
    });

  } catch (error) {
    console.error('Error in /book:', error);
    return res.status(500).json({ message: 'Error creating booking.', error: error.message });
  }
});

module.exports = router;