const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    locationId: { type: String, required: true },
    locationName: { type: String, required: true },
    floorNumber: { type: Number, default: 1 }, // Floor 1 to N
    bayNumber: { type: Number, required: true },   // Bay 1 to N
    vehicleNumber: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Booked", "Completed", "Cancelled"],
      default: "Booked",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);