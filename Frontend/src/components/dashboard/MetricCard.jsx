import React from 'react';

export default function MetricCard({ label, value, subtext, valueColor = 'text-white' }) {
  return (
    <div className="bg-[#131b2a] border border-slate-800/80 rounded-xl p-5 space-y-1">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold tracking-tight ${valueColor}`}>{value}</p>
      {subtext && <p className="text-[11px] text-slate-500">{subtext}</p>}
    </div>
  );
}