import React from 'react';

export default function BrandLogo({ size = 'md' }) {
  const isLarge = size === 'lg';

  return (
    <div className="flex items-center gap-3 group cursor-pointer select-none">
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 shadow-md shadow-red-600/25 group-hover:shadow-lg group-hover:shadow-red-600/35 transition-all duration-300 ${isLarge ? 'w-11 h-11' : 'w-9 h-9'}`}>
        {/* Flame Accent Ring */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-red-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px]" />
        
        {/* Custom ParkPulse Flame-P Mark */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`relative z-10 text-white transition-transform duration-300 group-hover:scale-105 ${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`}
        >
          {/* Flame Geometry Backing */}
          <path d="M12 2L15 8H9L12 2Z" fill="currentColor" fillOpacity="0.3" stroke="none" />
          {/* Executive P Symbol */}
          <path d="M7 21V4h6a4.5 4.5 0 0 1 0 9H7" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-black tracking-tight leading-none text-slate-900 ${isLarge ? 'text-xl' : 'text-base'}`}>
          Park<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">Pulse</span>
        </span>
        <span className="text-[9px] font-bold tracking-[0.2em] text-red-600/80 uppercase mt-0.5">
          Kannur Hub
        </span>
      </div>
    </div>
  );
}