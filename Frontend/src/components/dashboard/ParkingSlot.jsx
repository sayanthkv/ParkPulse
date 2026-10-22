import React from 'react';

export default function ParkingSlot({ slot, isUserLoggedIn, onSelect }) {
  const isAvailable = slot.status === 'AVAILABLE';
  const isReserved = slot.status === 'RESERVED';
  const isOccupied = slot.status === 'OCCUPIED';

  let statusStyles = 'border-slate-800/80 bg-[#131b2a]/30 text-slate-500';
  let badgeColor = 'bg-slate-600';

  if (isAvailable) {
    statusStyles = 'border-emerald-500/20 bg-emerald-500/[0.02] hover:border-emerald-500/50 cursor-pointer text-emerald-400';
    badgeColor = 'bg-emerald-400';
  } else if (isReserved) {
    statusStyles = 'border-amber-500/20 bg-amber-500/[0.02] text-amber-400';
    badgeColor = 'bg-amber-400';
  } else if (isOccupied) {
    statusStyles = 'border-rose-500/20 bg-rose-500/[0.02] text-rose-400';
    badgeColor = 'bg-rose-400';
  }

  return (
    <div
      onClick={() => isAvailable && isUserLoggedIn && onSelect(slot)}
      className={`p-4 border rounded-xl flex flex-col justify-between h-28 transition-all duration-150 ${statusStyles}`}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-white">{slot.slotNumber}</span>
        <span className={`w-1.5 h-1.5 rounded-full ${badgeColor}`}></span>
      </div>

      <div className="text-center">
        <span className="text-[11px] font-mono tracking-wider uppercase opacity-90">
          {slot.status}
        </span>
      </div>

      <div className="text-[10px] text-slate-500 flex justify-between">
        <span>Floor {slot.floor || 1}</span>
        <span>₹50/hr</span>
      </div>
    </div>
  );
}