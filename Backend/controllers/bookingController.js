const Booking = require("../models/Booking");

// 1. Create a new parking booking
const createBooking = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id || req.user?.id;
    const {
      locationId,
      locationName,
      floorNumber,
      bayNumber,
      vehicleNumber,
      bookingDate,
      startTime,
      endTime,
      totalAmount,
    } = req.body;

    // Check if bay is already booked for that location/floor/date
    const existingBooking = await Booking.findOne({
      locationId,
      floorNumber: Number(floorNumber || 1),
      bayNumber: Number(bayNumber),
      bookingDate,
      status: "Booked",
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: `Bay B-${bayNumber} on Floor ${floorNumber || 1} is already booked for this date!`,
      });
    }

    const newBooking = new Booking({
      user: userId,
      locationId,
      locationName,
      floorNumber: Number(floorNumber || 1),
      bayNumber: Number(bayNumber),
      vehicleNumber,
      bookingDate,
      startTime,
      endTime,
      totalAmount,
      status: "Booked",
    });

    const savedBooking = await newBooking.save();

    return res.status(201).json({
      success: true,
      message: "Parking slot booked successfully!",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Error in createBooking:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get user's active/past bookings
const getMyBookings = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id || req.user?.id;
    const bookings = await Booking.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get occupied bays for a specific location & floor
const getOccupiedBays = async (req, res) => {
  try {
    const { locationId, floorNumber, bookingDate } = req.query;

    const bookings = await Booking.find({
      locationId,
      floorNumber: Number(floorNumber || 1),
      bookingDate,
      status: "Booked",
    });

    const occupiedBayNumbers = bookings.map((b) => b.bayNumber);

    return res.status(200).json({
      success: true,
      occupiedBays: occupiedBayNumbers,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getOccupiedBays,
};