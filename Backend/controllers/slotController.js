const Slot = require('../models/Slot');
const Booking = require('../models/Booking');

// GET /api/slots - Fetch all parking slots with current status
exports.getSlots = async (req, res) => {
  try {
    const slots = await Slot.find().sort({ slotNumber: 1 });
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
exports.bookSlot = async (req, res) => {
  try {
    const { slotId, startTime, endTime } = req.body;
    const userId = req.user.userId;
    const vehicleNumber = req.user.vehicleNumber;

    if (!slotId || !startTime || !endTime) {
      return res.status(400).json({ message: 'Slot ID, start time, and end time are required.' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    // 1. Validate chronological order
    if (start >= end) {
      return res.status(400).json({ message: 'End time must be after start time.' });
    }

    if (start < new Date(now.getTime() - 5 * 60 * 1000)) { // 5-min grace window for clock drift
      return res.status(400).json({ message: 'Start time cannot be in the past.' });
    }

    // 2. Enforce 3-day maximum booking window from right now
    const maxBookingLimit = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    if (end > maxBookingLimit) {
      return res.status(400).json({ message: 'Reservations cannot exceed 3 days from today.' });
    }

    // 3. Check slot existence & availability
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found.' });
    }

    // Check for overlapping active bookings on this slot
    const existingOverlappingBooking = await Booking.findOne({
      slotId,
      status: { $in: ['BOOKED', 'ACTIVE'] },
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    if (existingOverlappingBooking) {
      return res.status(400).json({ message: 'This slot is already reserved for the selected time window.' });
    }

    // 4. Calculate total hours & base fee (₹50/hour, rounded up to full hours)
    const durationMs = end - start;
    const durationHours = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));
    const baseFee = durationHours * 50;

    const booking = new Booking({
      userId,
      slotId,
      vehicleNumber,
      startTime: start,
      endTime: end,
      baseFee,
      status: 'BOOKED'
    });

    await booking.save();

    // Update slot status
    slot.status = 'RESERVED';
    await slot.save();

    res.status(201).json({
      message: `Slot ${slot.slotNumber} reserved successfully for ${durationHours} hour(s)!`,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking.', error: error.message });
  }
};