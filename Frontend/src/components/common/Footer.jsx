import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-transparent border-t border-white/10 mt-auto relative z-40">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Kannur Brand Mark */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-xs shadow-md shadow-red-600/40">
            P
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-white tracking-tight drop-shadow-md">
              Park<span className="text-red-500">Pulse</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-zinc-300 uppercase">
              KANNUR HUB
            </span>
          </div>
        </div>

        {/* Clean Nav Links */}
        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-zinc-200">
          <Link to="/" className="hover:text-red-500 transition drop-shadow-md">
            Home
          </Link>
          <Link to="/locations" className="hover:text-red-500 transition drop-shadow-md">
            Locations
          </Link>
          <Link to="/login" className="hover:text-red-500 transition drop-shadow-md">
            Sign In
          </Link>
        </div>

        {/* Copyright Notice */}
        <p className="text-xs font-mono font-semibold text-zinc-300 drop-shadow-md">
          © {new Date().getFullYear()} PARKPULSE KANNUR NETWORK
        </p>
      </div>
    </footer>
  );
}