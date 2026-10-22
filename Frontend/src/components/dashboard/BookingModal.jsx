import React, { useState } from 'react';

export default function BookingModal({ slot, onConfirm, onClose }) {
  const [hours, setHours] = useState(1);

  if (!slot) return null;

  // src/components/dashboard/BookingModal.jsx
const handleSubmit = (e) => {
  e.preventDefault();
  
  // Make sure durationHours is passed explicitly as a number
  onConfirm({ 
    slotId: slot._id, 
    durationHours: Number(hours) || 1 
  });
};
  const baseRate = slot.locationId?.baseRate || 25;
  const totalFee = baseRate * hours;

  // Real-time calculated end time display
  const now = new Date();
  const endTimeCalculated = new Date(now.getTime() + hours * 60 * 60 * 1000);
  const formattedEndTime = endTimeCalculated.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-black/60 border border-white/20 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/40 bg-black/40 text-[10px] font-mono tracking-widest uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>BAY RESERVATION</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Reserve Bay <span className="text-red-500">{slot.slotNumber}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white font-mono text-lg transition p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Slot Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-black/40 border border-white/10 p-3 rounded-xl">
            <span className="text-zinc-400 font-mono text-[10px] uppercase block">Hub</span>
            <span className="font-bold text-white truncate block">{slot.locationId?.name || 'Kannur Hub'}</span>
          </div>
          <div className="bg-black/40 border border-white/10 p-3 rounded-xl">
            <span className="text-zinc-400 font-mono text-[10px] uppercase block">Valid Until</span>
            <span className="font-bold text-emerald-400 block font-mono">{formattedEndTime}</span>
          </div>
        </div>

        {/* Duration Selection Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-200 font-bold mb-2">
              Duration (Hours)
            </label>
            <div className="flex items-center gap-2.5">
              {[1, 2, 4, 8, 12].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setHours(num)}
                  className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold transition border cursor-pointer ${
                    hours === num
                      ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/40'
                      : 'bg-black/40 text-zinc-300 border-white/10 hover:border-white/30'
                  }`}
                >
                  {num}h
                </button>
              ))}
            </div>
          </div>

          {/* Fee Calculation */}
          <div className="bg-black/50 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-300 font-medium block">Total Estimate</span>
              <span className="text-[10px] text-zinc-400 font-mono">₹{baseRate} × {hours} hrs</span>
            </div>
            <span className="text-2xl font-black font-mono text-white drop-shadow-md">
              ₹{totalFee}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-black/40 hover:bg-black/70 border border-white/20 text-zinc-300 font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/40 cursor-pointer"
            >
              Confirm Booking
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}