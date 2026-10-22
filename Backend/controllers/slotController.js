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