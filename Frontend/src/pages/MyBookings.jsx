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
        setBookings(res.data?.bookings || res.data || []);
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
              const locationName = b.locationName || b.slotId?.locationId?.name || 'Kannur Parking Hub';
              const floorNumber = b.floorNumber || 1;
              const bayNumber = b.bayNumber || b.slotNumber || 'P1';
              const vehicleNumber = b.vehicleNumber || 'N/A';
              const totalAmount = b.totalAmount || 0;
              const passId = b._id ? b._id.slice(-8).toUpperCase() : 'PASS-OK';

              return (
                <div
                  key={b._id}
                  className="bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4 shadow-2xl hover:border-red-500/60 transition"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between border-b border-white/10 pb-3">
                    <div>
                      <h3 className="font-bold text-white text-base">
                        {locationName}
                      </h3>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        PASS ID: #{passId}
                      </p>
                    </div>
                    <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-mono font-bold px-3 py-1 rounded-full uppercase">
                      Confirmed
                    </span>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-3.5 rounded-xl border border-white/10 text-xs">
                    <div>
                      <span className="block text-zinc-400 text-[10px] font-mono uppercase">Floor</span>
                      <strong className="text-white text-sm font-bold">Floor {floorNumber}</strong>
                    </div>

                    <div>
                      <span className="block text-zinc-400 text-[10px] font-mono uppercase">Bay Number</span>
                      <strong className="text-red-400 text-sm font-bold">Bay B-{bayNumber}</strong>
                    </div>

                    <div>
                      <span className="block text-zinc-400 text-[10px] font-mono uppercase">Vehicle No.</span>
                      <strong className="text-white text-sm font-bold">{vehicleNumber}</strong>
                    </div>

                    <div>
                      <span className="block text-zinc-400 text-[10px] font-mono uppercase">Total Paid</span>
                      <strong className="text-emerald-400 text-sm font-bold">₹{totalAmount}</strong>
                    </div>
                  </div>

                  {/* Date & Time Row */}
                  {(b.bookingDate || b.startTime) && (
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono pt-1">
                      <span>Date: {b.bookingDate || 'Today'}</span>
                      {b.startTime && b.endTime && (
                        <span>Time: {b.startTime} - {b.endTime}</span>
                      )}
                    </div>
                  )}
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