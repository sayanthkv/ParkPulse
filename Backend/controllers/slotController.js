const Slot = require('../models/Slot');
const Booking = require('../models/Booking');

// GET /api/slots - Fetch slots for location
exports.getSlots = async (req, res) => {
  try {
    const { locationId } = req.query;
    if (!locationId) {
      return res.status(400).json({ message: 'Location ID is required.' });
    }
    const slots = await Slot.find({ locationId }).sort({ slotNumber: 1 });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching slots.', error: error.message });
  }
};

// GET /api/slots/my-bookings - User passes
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user?.userId;
    const bookings = await Booking.find({ userId })
      .populate({
        path: 'slotId',
        populate: { path: 'locationId' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings.', error: error.message });
  }
};