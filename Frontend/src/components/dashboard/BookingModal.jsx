import React, { useState, useEffect } from 'react';

export default function BookingModal({ slot, onConfirm, onClose }) {
  if (!slot) return null;

  // Helper to format Date into 'YYYY-MM-DDTHH:mm' for datetime-local inputs
  const formatForInput = (date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const now = new Date();
  const defaultEnd = new Date(now.getTime() + 2 * 60 * 60 * 1000); // Default 2-hour window
  const maxLimit = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days max

  const minDateTimeStr = formatForInput(now);
  const maxDateTimeStr = formatForInput(maxLimit);

  const [startTime, setStartTime] = useState(minDateTimeStr);
  const [endTime, setEndTime] = useState(formatForInput(defaultEnd));
  const [totalFee, setTotalFee] = useState(100);
  const [error, setError] = useState('');

  // Recalculate fee on date/time change
  useEffect(() => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      setError('End time must be after start time.');
      setTotalFee(0);
      return;
    }

    if (end > maxLimit) {
      setError('Reservations cannot extend beyond 3 days from today.');
      setTotalFee(0);
      return;
    }

    setError('');
    const durationMs = end - start;
    const hours = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));
    setTotalFee(hours * 50);
  }, [startTime, endTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error) return;
    onConfirm({
      slotId: slot._id,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-[#131b2a] border border-slate-800 rounded-xl p-6 w-full max-w-sm space-y-5">
        <div>
          <h3 className="text-base font-bold text-white">Reserve Bay {slot.slotNumber}</h3>
          <p className="text-xs text-slate-400 mt-1">Select date & time (up to 3 days in advance)</p>
        </div>

        {error && (
          <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Start Time</label>
            <input
              type="datetime-local"
              required
              min={minDateTimeStr}
              max={maxDateTimeStr}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-[#0b0f17] border border-slate-800 rounded-lg px-3.5 py-2 text-white text-xs outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">End Time</label>
            <input
              type="datetime-local"
              required
              min={startTime}
              max={maxDateTimeStr}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-[#0b0f17] border border-slate-800 rounded-lg px-3.5 py-2 text-white text-xs outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <span>Calculated Fee (₹50/hr)</span>
            <span className="text-sm font-bold text-white">₹{totalFee}</span>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="submit"
              disabled={Boolean(error)}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-2 rounded-lg text-xs transition"
            >
              Confirm Booking
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}