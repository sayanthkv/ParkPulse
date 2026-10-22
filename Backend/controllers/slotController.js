const Slot = require('../models/Slot');
const Booking = require('../models/Booking');

// GET /api/slots - Fetch all parking slots with current status
// GET /api/slots?locationId=...
// GET /api/slots?locationId=...
exports.getSlots = async (req, res) => {
  try {
    const { locationId } = req.query;

    if (!locationId) {
      return res.status(400).json({ message: 'Location ID is required to fetch slots.' });
    }

    // Strictly fetch slots belonging ONLY to this location
    const slots = await Slot.find({ locationId }).sort({ slotNumber: 1 });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching slots.', error: error.message });
  }
};

// POST /api/slots/book - Reserve a parking slot
exports.bookSlot = async (req, res) => {
  try {
    const { slotId, durationHours } = req.body;
    const userId = req.user.userId;
    const vehicleNumber = req.user.vehicleNumber;

    // Check slot existence and availability
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found.' });
    }
    if (slot.status !== 'AVAILABLE') {
      return res.status(400).json({ message: 'Slot is currently occupied or reserved.' });
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
    const hourlyRate = 50; // ₹50 per hour base fee
    const baseFee = durationHours * hourlyRate;

    // Create booking record
    const booking = new Booking({
      userId,
      slotId,
      vehicleNumber,
      startTime,
      endTime,
      baseFee,
      status: 'BOOKED'
    });

    await booking.save();

    // Update slot state to RESERVED
    slot.status = 'RESERVED';
    await slot.save();

    res.status(201).json({
      message: 'Slot reserved successfully!',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking.', error: error.message });
  }
};
// POST /api/slots/extend - Extend an existing booking duration
exports.extendBooking = async (req, res) => {
  try {
    const { bookingId, additionalHours } = req.body;

    if (!bookingId || !additionalHours) {
      return res.status(400).json({ message: 'Booking ID and additional hours are required.' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
      return res.status(400).json({ message: 'Cannot extend a completed or cancelled booking.' });
    }

    // Calculate new end time and fee
    const currentEndTime = new Date(booking.endTime);
    const newEndTime = new Date(currentEndTime.getTime() + additionalHours * 60 * 60 * 1000);
    const additionalFee = additionalHours * 50; // ₹50 per extra hour

    booking.endTime = newEndTime;
    booking.baseFee += additionalFee;
    booking.reminderSent = false; // Reset so user receives a warning for the new end time
    await booking.save();

    res.status(200).json({
      message: `Booking successfully extended by ${additionalHours} hour(s)!`,
      newEndTime: booking.endTime,
      updatedTotalFee: booking.baseFee,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error extending booking.', error: error.message });
  }
};
// GET /api/slots/my-bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .populate('slotId')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings.', error: error.message });
  }
};
// POST /api/slots/book - Reserve a parking slot with custom start/end times
// POST /api/slots/book
exports.bookSlot = async (req, res) => {
  try {
    const { slotId, startTime, endTime } = req.body;
    
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found.' });
    }

    // Check overlapping bookings strictly for THIS slotId
    const existingBooking = await Booking.findOne({
      slotId: slot._id,
      status: { $in: ['BOOKED', 'ACTIVE'] },
      $or: [{ startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } }]
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This slot is already reserved for the selected time window.' });
    }

    // Lock ONLY this slot
    slot.status = 'RESERVED';
    await slot.save();

    const booking = new Booking({
      userId: req.user.userId,
      slotId: slot._id,
      locationId: slot.locationId,
      vehicleNumber: req.user.vehicleNumber,
      startTime,
      endTime,
      baseFee: req.body.baseFee || 50,
      status: 'BOOKED'
    });

    await booking.save();

    res.status(201).json({ message: `Slot ${slot.slotNumber} reserved successfully!`, booking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking.', error: error.message });
  }
};