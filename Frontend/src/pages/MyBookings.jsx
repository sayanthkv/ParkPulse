import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyBookings = async () => {
      try {
        const res = await API.get('/slots/my-bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Error loading bookings:', err);
        setError(err.response?.data?.message || 'Failed to fetch passes.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [user, navigate]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden flex flex-col justify-between pt-28 pb-8 px-6 bg-zinc-950">
      
      {/* Blurred Kannur Backdrop */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-105 blur-sm opacity-90 transition-all duration-300"
        style={{ backgroundImage: `url('/kannur-bg.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full space-y-8 my-auto">
        
        {/* Header */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-[11px] font-mono tracking-widest uppercase shadow-xl">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-zinc-200 font-medium">DRIVER PASS MANAGEMENT</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
            My Active <span className="text-red-500">Passes</span>
          </h1>
          <p className="text-zinc-200 text-xs font-semibold">
            Track and manage your parking reservations across Kannur hubs
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-950/80 border border-red-500/50 rounded-2xl text-xs text-red-200 font-medium text-center">
            {error}
          </div>
        )}

        {/* Bookings Grid */}
        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-zinc-300 tracking-widest uppercase font-bold">
            Loading active passes...
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-black/50 backdrop-blur-md border border-white/20 rounded-3xl p-12 text-center space-y-4 shadow-2xl">
            <p className="text-zinc-300 font-semibold text-sm">You have no active parking reservations.</p>
            <button
              onClick={() => navigate('/locations')}
              className="bg-red-600 hover:bg-red-500 text-white font-black px-8 py-3 rounded-xl text-xs uppercase tracking-widest transition shadow-lg shadow-red-600/40 cursor-pointer"
            >
              Book Parking Hub Now →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((b) => {
              const slotNum = b.slotNumber || b.slotId?.slotNumber || 'P1';
              const hubName = b.slotId?.locationId?.name || 'Kannur Parking Hub';
              const address = b.slotId?.locationId?.address || 'Kannur, Kerala';
              const passId = b._id ? b._id.slice(-8).toUpperCase() : 'PASS-OK';

              return (
                <div
                  key={b._id}
                  className="bg-black/50 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4 shadow-2xl hover:border-red-500/60 transition"
                >
                  <div className="flex items-start justify-between border-b border-white/10 pb-3">
                    <div>
                      <h3 className="font-bold text-white text-base">
                        {hubName}
                      </h3>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        📍 {address}
                      </p>
                    </div>
                    <span className="bg-red-600/80 border border-red-400/50 text-white text-xs font-mono font-bold px-3 py-1 rounded-full uppercase">
                      Bay {slotNum}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono text-xs text-zinc-300">
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase">Pass ID</span>
                      <span className="font-bold text-white uppercase">{passId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase">Fee Paid</span>
                      <span className="font-bold text-white">₹{b.baseFee || 25}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase">Vehicle</span>
                      <span className="font-bold text-white uppercase">{b.vehicleNumber || 'KL-13'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase">Status</span>
                      <span className="font-bold text-emerald-400 uppercase">{b.status || 'BOOKED'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      <footer className="relative z-10 max-w-6xl mx-auto w-full text-center border-t border-white/20 pt-4 mt-8">
        <p className="text-xs text-zinc-200 font-mono font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          PARKPULSE PLATFORM • KANNUR CORPORATION & RAILWAY PARKING NETWORK
        </p>
      </footer>

    </div>
  );
}