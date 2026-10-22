import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Locations({ user }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await API.get('/locations');
        setLocations(res.data);
      } catch (err) {
        console.error('Error fetching locations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const handleSelect = (location) => {
    if (user) {
      // Logged in: Proceed directly to booking
      navigate('/booking', { state: { selectedLocation: location } });
    } else {
      // Not logged in: Redirect to signup with state saved
      navigate('/signup', { state: { selectedLocation: location, redirectedFrom: '/locations' } });
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden flex flex-col justify-between pt-28 pb-8 px-6 bg-zinc-950">
      
      {/* 🖼️ BLURRED KANNUR BACKDROP */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-105 blur-sm opacity-90 transition-all duration-300"
        style={{ backgroundImage: `url('/kannur-bg.jpg')` }}
      />

      {/* Subtle Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-8 my-auto">
        
        {/* Header Section */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-[11px] font-mono tracking-widest uppercase shadow-xl">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-zinc-200 font-medium">KANNUR DISTRICT PARKING NETWORK</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            Select Destination <span className="text-red-500">Hub</span>
          </h1>

          <p className="text-zinc-100 text-sm max-w-xl font-semibold leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            Browse verified multi-level complexes and station hubs across Kannur for real-time bay availability and advance reservation.
          </p>
        </div>

        {/* Location Hubs Grid */}
        {loading ? (
          <div className="py-24 text-center font-mono text-xs text-zinc-200 tracking-widest uppercase font-bold drop-shadow-md">
            Loading Kannur parking facilities...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {locations.map((loc) => (
              <div
                key={loc._id}
                className="group relative bg-black/40 backdrop-blur-md border border-white/20 hover:border-red-500/80 rounded-2xl p-7 flex flex-col justify-between space-y-6 transition duration-300 shadow-2xl hover:shadow-red-600/20"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-bold text-white group-hover:text-red-400 transition duration-200 drop-shadow-md">
                      {loc.name}
                    </h2>
                    <span className="text-xs font-mono font-bold text-white bg-red-600/80 border border-red-400/50 px-3 py-1 rounded-full whitespace-nowrap shadow-md">
                      From ₹{loc.baseRate}/hr
                    </span>
                  </div>

                  <p className="text-xs text-zinc-200 font-mono flex items-center gap-1.5 font-bold drop-shadow-md">
                    📍 {loc.address}
                  </p>

                  <p className="text-xs text-zinc-100 leading-relaxed pt-1 font-semibold drop-shadow-md">
                    {loc.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/20 pt-5">
                  <div className="text-xs text-zinc-200 font-bold drop-shadow-md">
                    Capacity: <strong className="text-white font-black">{loc.capacity} Bays</strong> • {loc.totalFloors} {loc.totalFloors > 1 ? 'Floors' : 'Level'}
                  </div>

                  {/* Dynamic CTA depending on login status */}
                  <button
                    onClick={() => handleSelect(loc)}
                    className="bg-red-600 hover:bg-red-500 text-white text-xs font-black px-6 py-2.5 rounded-xl uppercase tracking-wider transition duration-200 shadow-lg shadow-red-600/40 cursor-pointer"
                  >
                    {user ? 'Select Hub →' : 'Sign Up to Select Hub →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Transparent Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full text-center border-t border-white/20 pt-4 mt-8">
        <p className="text-xs text-zinc-200 font-mono font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          PARKPULSE PLATFORM • KANNUR CORPORATION & RAILWAY PARKING NETWORK
        </p>
      </footer>

    </div>
  );
}