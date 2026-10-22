import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

export default function BookingConfirmation() {
  const { state } = useLocation();
  const booking = state?.booking;
  const location = state?.location;

  if (!booking) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-[#131b2a] border border-slate-800 rounded-xl">
        <p className="text-xs text-slate-400">No active booking details found.</p>
        <Link to="/locations" className="text-blue-400 text-xs font-medium mt-4 inline-block">Return to Locations</Link>
      </div>
    );
  }

  // QR Payload string for gate scanning
  const qrData = JSON.stringify({
    bookingId: booking._id,
    vehicleNumber: booking.vehicleNumber,
    location: location?.name
  });

  return (
    <div className="max-w-md mx-auto my-10 px-4">
      <div className="bg-[#131b2a] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
        <div className="text-center space-y-1">
          <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block mb-1 animate-pulse"></span>
          <h2 className="text-lg font-bold text-white tracking-tight">Booking Confirmed</h2>
          <p className="text-xs text-slate-400">Kannur Smart Parking Access Pass</p>
        </div>

        {/* QR Code Pass */}
        <div className="bg-white p-4 rounded-xl flex justify-center w-fit mx-auto shadow-inner">
          <QRCodeSVG value={qrData} size={160} />
        </div>

        {/* Details Breakdown */}
        <div className="space-y-3 border-t border-slate-800/80 pt-4 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Location</span>
            <span className="text-white font-semibold text-right max-w-[200px]">{location?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Address</span>
            <span className="text-slate-300 font-mono text-right max-w-[200px]">{location?.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Vehicle Number</span>
            <span className="text-blue-400 font-mono font-bold">{booking.vehicleNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Start Time</span>
            <span className="text-slate-200">{new Date(booking.startTime).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">End Time</span>
            <span className="text-slate-200">{new Date(booking.endTime).toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-slate-800/80 pt-3 text-sm">
            <span className="text-slate-300 font-medium">Paid Amount</span>
            <span className="text-emerald-400 font-bold">₹{booking.baseFee}</span>
          </div>
        </div>

        <Link
          to="/my-bookings"
          className="block text-center bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-xs transition"
        >
          View My Bookings
        </Link>
      </div>
    </div>
  );
}