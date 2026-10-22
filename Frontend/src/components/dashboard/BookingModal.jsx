import React from 'react';

export default function BookingModal({ slot, duration, setDuration, onConfirm, onClose }) {
  if (!slot) return null;

  const totalFee = Number(duration) * 50;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-[#131b2a] border border-slate-800 rounded-xl p-6 w-full max-w-sm space-y-5">
        <div>
          <h3 className="text-base font-bold text-white">Reserve Bay {slot.slotNumber}</h3>
          <p className="text-xs text-slate-400 mt-1">Select reservation duration</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Hours Required</label>
            <input
              type="number"
              min="1"
              max="12"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-[#0b0f17] border border-slate-800 rounded-lg px-3.5 py-2 text-white text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <span>Calculated Fee</span>
            <span className="text-sm font-bold text-white">₹{totalFee}</span>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={onConfirm}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-xs transition"
          >
            Confirm Booking
          </button>
          <button
            onClick={onClose}
            className="px-4 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}