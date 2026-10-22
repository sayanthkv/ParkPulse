import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function BookingConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const booking = state?.booking;
  const location = state?.location;

  if (!booking) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white px-6">
        <p className="text-zinc-400 font-mono text-xs mb-4">No active pass details found.</p>
        <Link to="/locations" className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider">
          Return to Hubs
        </Link>
      </div>
    );
  }

  const passId = booking._id || 'PKP-8821';
  const slotNum = booking.slotNumber || booking.slotId?.slotNumber || 'P1';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    `PARKPULSE-PASS:${passId}-BAY:${slotNum}`
  )}&color=ffffff&bgcolor=18181b`;

  return (
    <div className="relative min-h-screen text-white overflow-hidden flex flex-col justify-between pt-28 pb-12 px-6 bg-zinc-950">
      
      {/* Blurred Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-105 blur-sm opacity-90 transition-all duration-300"
        style={{ backgroundImage: `url('/kannur-bg.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto w-full my-auto space-y-6">
        
        {/* Pass Card Container */}
        <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-red-400 font-bold">
              DIGITAL ENTRY PASS
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight">Booking Confirmed</h1>
            <p className="text-xs text-zinc-300 font-semibold">{location?.name || 'Kannur Parking Hub'}</p>
          </div>

          {/* 📲 BARRIER SCAN QR CODE */}
          <div className="bg-zinc-900/90 border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 max-w-[200px] mx-auto shadow-inner">
            <img 
              src={qrUrl} 
              alt="Parking Pass QR Code" 
              className="w-32 h-32 rounded-lg border border-white/10"
            />
            <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
              SCAN AT BOOTH BARRIER
            </span>
          </div>

          {/* Pass Details Box */}
          <div className="bg-black/50 border border-white/10 rounded-2xl p-5 space-y-3.5 text-left font-mono text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
              <span className="text-zinc-400 uppercase text-[10px]">Pass ID</span>
              <span className="font-bold text-white uppercase">{passId.slice(-8)}</span>
            </div>

            <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
              <span className="text-zinc-400 uppercase text-[10px]">Bay Number</span>
              <span className="font-black text-red-500 text-base">{slotNum}</span>
            </div>

            <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
              <span className="text-zinc-400 uppercase text-[10px]">Vehicle No</span>
              <span className="font-bold text-white uppercase">{booking.vehicleNumber || 'KL-13-AB-1234'}</span>
            </div>

            <div className="flex justify-between items-center pt-0.5">
              <span className="text-zinc-400 uppercase text-[10px]">Total Paid</span>
              <span className="font-black text-white text-base">₹{booking.baseFee || 25}</span>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <button
              onClick={() => navigate('/my-bookings')}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition shadow-lg shadow-red-600/40 cursor-pointer"
            >
              View My Passes →
            </button>
            <button
              onClick={() => navigate('/locations')}
              className="w-full bg-black/40 hover:bg-black/70 border border-white/20 text-zinc-300 font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition cursor-pointer"
            >
              Book Another Slot
            </button>
          </div>

        </div>

      </div>

      {/* Transparent Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full text-center border-t border-white/20 pt-4 mt-8">
        <p className="text-xs text-zinc-200 font-mono font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          PARKPULSE PLATFORM • KANNUR CORPORATION & RAILWAY PARKING NETWORK
        </p>
      </footer>

    </div>
  );
}