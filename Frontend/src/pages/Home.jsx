import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({ user }) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-white overflow-hidden flex flex-col justify-between pt-24 pb-10 px-6 bg-zinc-950">
      
      {/* 🖼️ Full-bleed Kannur Backdrop */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-100 transition-all duration-300"
        style={{ 
          backgroundImage: `url('/kannur-bg.jpg')` 
        }}
      />

      {/* Subtle Bottom & Top Gradient for Reading Comfort */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-12 my-auto">
        
        {/* Top Minimal Pill Tag */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-[11px] font-mono tracking-widest uppercase shadow-xl">
            <span className="text-zinc-200 font-medium">SMART PARKING PLATFORM •</span>
            <span className="text-red-500 font-bold">KANNUR, KERALA</span>
          </div>
        </div>

        {/* Clean Hero Title & Subtitle without Heavy Boxes */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none [text-shadow:_0_4px_30px_rgba(0,0,0,0.8)]">
            Effortless Parking <br />
            <span className="text-red-500">In Kannur</span>
          </h1>

          <p className="text-zinc-100 text-sm sm:text-base font-semibold leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] max-w-2xl mx-auto pt-2">
            Real-time space reservation across Stadium Road, Railway Station, New Bus Stand, and Ashirvad Car Parking.
          </p>
        </div>

        {/* Minimal Metrics Grid & Glowing Crimson CTA */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 pt-2">
          
          {/* Left Metrics (Clean Text Layout with Subtle Shadow) */}
          <div className="space-y-6 text-center md:text-left animate-fade-in-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-red-500 text-xs">◆</span>
                <span className="text-3xl font-extrabold font-mono tracking-tight text-white drop-shadow-md">124+</span>
              </div>
              <p className="text-xs text-zinc-200 uppercase tracking-wider font-bold drop-shadow-md mt-1">
                Multi-Level Car Bays
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-red-500 text-xs">◆</span>
                <span className="text-3xl font-extrabold font-mono tracking-tight text-white drop-shadow-md">4 HUBS</span>
              </div>
              <p className="text-xs text-zinc-200 uppercase tracking-wider font-bold drop-shadow-md mt-1">
                Prime Locations
              </p>
            </div>
          </div>

          {/* Center Main Crimson Button */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 opacity-80 blur-lg group-hover:opacity-100 transition duration-300" />
              <button
                onClick={() => navigate('/locations')}
                className="relative bg-red-600 hover:bg-red-500 text-white font-black px-12 py-4.5 rounded-2xl text-sm tracking-widest uppercase transition duration-300 shadow-2xl cursor-pointer"
              >
                BOOK NOW
              </button>
            </div>
            <p className="text-[10px] font-mono text-zinc-200 uppercase tracking-widest font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Reserve up to 3 days in advance
            </p>
          </div>

          {/* Right Metrics */}
          <div className="space-y-6 text-center md:text-right animate-fade-in-right">
            <div>
              <div className="flex items-center justify-center md:justify-end gap-2">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-white drop-shadow-md">24/7</span>
                <span className="text-red-500 text-xs">◆</span>
              </div>
              <p className="text-xs text-zinc-200 uppercase tracking-wider font-bold drop-shadow-md mt-1">
                Operational Support
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center md:justify-end gap-2">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-white drop-shadow-md">₹25/hr</span>
                <span className="text-red-500 text-xs">◆</span>
              </div>
              <p className="text-xs text-zinc-200 uppercase tracking-wider font-bold drop-shadow-md mt-1">
                Starting Rates
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Line */}
      <div className="relative z-10 max-w-6xl mx-auto w-full text-center border-t border-white/20 pt-4">
        <p className="text-xs text-zinc-300 font-mono font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          PARKPULSE PLATFORM • KANNUR CORPORATION & RAILWAY PARKING NETWORK
        </p>
      </div>

    </div>
  );
}