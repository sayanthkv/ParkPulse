import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0b0f17] border-t border-slate-800/80 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-sm font-semibold text-white tracking-tight">ParkPulse</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Enterprise Smart Parking Management Platform</p>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/booking" className="hover:text-white transition">Book Slot</Link>
          <Link to="/login" className="hover:text-white transition">Sign In</Link>
        </div>

        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} ParkPulse Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}