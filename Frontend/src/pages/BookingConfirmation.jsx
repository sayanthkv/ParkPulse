import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";

export default function BookingConfirmation({ user, bookingData: propBookingData }) {
  const navigate = useNavigate();
  const routeState = useLocation().state;

  const booking = routeState?.bookingData || propBookingData;

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!booking) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-zinc-400">No slot selected.</p>
          <button
            onClick={() => navigate("/locations")}
            className="bg-red-600 text-white px-6 py-2 rounded-xl text-xs font-bold"
          >
            Go to Locations
          </button>
        </div>
      </div>
    );
  }

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) {
      setError("Please enter your vehicle registration number.");
      return;
    }

    try {
      setLoading(true);
      setError("");

     const payload = {

  slotId: booking.slotId || `${booking.locationId}-F${booking.floorNumber}-B${booking.bayNumber}`,
  locationId: booking.locationId,
  locationName: booking.locationName,
  floorNumber: booking.floorNumber,
  bayNumber: booking.bayNumber,
  vehicleNumber: vehicleNumber.trim().toUpperCase(),
  totalAmount: booking.totalAmount || 100,
  bookingDate: new Date().toISOString().split("T")[0],
  startTime: "10:00 AM",
  endTime: "06:00 PM",
};

      await API.post("/slots/book", payload);
      alert("Booking confirmed successfully!");
      navigate("/my-bookings");
    } catch (err) {
      console.error("Failed to book slot:", err);
      setError(err.response?.data?.message || "Failed to confirm booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white bg-zinc-950 pt-28 pb-12 px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-black/60 border border-white/20 rounded-3xl p-8 space-y-6 shadow-2xl backdrop-blur-md">
        <div className="text-center space-y-1">
          <span className="text-red-500 text-[10px] font-mono uppercase tracking-widest font-bold">
            CONFIRM RESERVATION
          </span>
          <h2 className="text-2xl font-black text-white">Pass Confirmation</h2>
        </div>

        {/* Selected Slot Summary */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 text-xs font-mono">
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-zinc-400">Facility:</span>
            <strong className="text-white text-right">{booking.locationName}</strong>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-zinc-400">Floor Level:</span>
            <strong className="text-white">Floor {booking.floorNumber}</strong>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-zinc-400">Selected Bay:</span>
            <strong className="text-red-400">Bay B-{booking.bayNumber}</strong>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-zinc-400">Total Price:</span>
            <strong className="text-emerald-400">₹{booking.totalAmount || 100}</strong>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-200 text-center">
            {error}
          </div>
        )}

        {/* Vehicle Registration Input */}
        <form onSubmit={handleConfirmBooking} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">
              Vehicle Registration Number
            </label>
            <input
              type="text"
              placeholder="e.g. KL-13-AB-1234"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full bg-black/80 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 font-mono tracking-wider uppercase"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-widest transition shadow-lg shadow-red-600/40"
          >
            {loading ? "Processing..." : "Confirm & Pay Pass →"}
          </button>
        </form>
      </div>
    </div>
  );
}