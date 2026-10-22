import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({ user }) {
  const navigate = useNavigate();

  const handleBookSlotClick = () => {
    if (user) {
      navigate('/booking');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-500 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
          Real-Time IoT Parking Systems
        </span>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Smart Parking Reservations Made Effortless.
        </h1>

        <p className="text-base text-slate-400 leading-relaxed">
          Locate available parking bays, reserve your spot instantly, and experience frictionless ANPR gate access with live telemetry tracking.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleBookSlotClick}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition shadow-lg shadow-blue-600/25"
          >
            Book a Slot Now →
          </button>
        </div>
      </div>

      {/* Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#131b2a] border border-slate-800/80 rounded-2xl p-6 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm font-bold">
            01
          </div>
          <h3 className="text-base font-bold text-white">Live Telemetry</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time optical sensor integration updating slot status instantly across all parking levels.
          </p>
        </div>

        <div className="bg-[#131b2a] border border-slate-800/80 rounded-2xl p-6 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm font-bold">
            02
          </div>
          <h3 className="text-base font-bold text-white">Automated Barrier</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Automatic Number Plate Recognition (ANPR) syncs license plates to lift entry barriers seamlessly.
          </p>
        </div>

        <div className="bg-[#131b2a] border border-slate-800/80 rounded-2xl p-6 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm font-bold">
            03
          </div>
          <h3 className="text-base font-bold text-white">Smart Reminders</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Proactive background scheduler sends alerts 5 minutes prior to session expiration.
          </p>
        </div>
      </div>
    </div>
  );
}