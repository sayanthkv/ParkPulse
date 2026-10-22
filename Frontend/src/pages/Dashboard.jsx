import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api';
import MetricCard from '../components/dashboard/MetricCard';
import ParkingSlot from '../components/dashboard/ParkingSlot';
import BookingModal from '../components/dashboard/BookingModal';

export default function Dashboard({ user }) {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [currentLocation, setCurrentLocation] = useState(state?.selectedLocation || null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState('');

  // Fallback if user opens /booking directly without selecting location first
  useEffect(() => {
    if (!currentLocation) {
      API.get('/locations').then((res) => {
        if (res.data.length > 0) setCurrentLocation(res.data[0]);
      });
    }
  }, [currentLocation]);

  // Fetch slots strictly scoped to the active locationId
  const fetchSlots = async () => {
    if (!currentLocation?._id) return;
    try {
      const res = await API.get(`/slots?locationId=${currentLocation._id}`);
      setSlots(res.data);
    } catch (err) {
      console.error('Error fetching location slots:', err);
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 3000);
    return () => clearInterval(interval);
  }, [currentLocation]);

  const handleBookSlot = async (bookingData) => {
  try {
    // bookingData MUST be { slotId: '...', durationHours: 1 }
    const res = await API.post('/slots/book', bookingData);
    setSelectedSlot(null);
    navigate('/confirmation', {
      state: {
        booking: res.data.booking,
        location: currentLocation,
      },
    });
  } catch (err) {
    setMessage(`❌ ${err.response?.data?.message || 'Booking failed'}`);
  }
};
  const occupiedCount = slots.filter((s) => s.status === 'OCCUPIED').length;
  const reservedCount = slots.filter((s) => s.status === 'RESERVED').length;
  const availableCount = slots.filter((s) => s.status === 'AVAILABLE').length;

  return (
    <div className="relative min-h-screen text-white overflow-hidden flex flex-col justify-between pt-28 pb-8 px-6 bg-zinc-950">
      
      {/* 🖼️ BLURRED KANNUR BACKDROP */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-105 blur-sm opacity-90 transition-all duration-300"
        style={{ backgroundImage: `url('/kannur-bg.jpg')` }}
      />

      {/* Dark Vignette Overlay for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-8 my-auto">
        
        {/* Top Location Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/40 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/40 bg-black/50 text-[10px] font-mono tracking-widest uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>ACTIVE KANNUR HUB</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              {currentLocation ? currentLocation.name : 'Loading Hub...'}
            </h1>
            <p className="text-xs text-zinc-200 font-mono font-bold mt-1 drop-shadow-md">
              📍 {currentLocation ? currentLocation.address : 'Kannur'}
            </p>
          </div>

          <button
            onClick={() => navigate('/locations')}
            className="text-xs font-bold uppercase tracking-wider text-white border border-white/30 hover:border-red-500 bg-red-600/30 hover:bg-red-600 px-5 py-2.5 rounded-xl transition shadow-lg backdrop-blur-xs cursor-pointer self-start md:self-auto"
          >
            ← Switch Hub
          </button>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/40 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl">
            <p className="text-xs text-zinc-300 uppercase tracking-wider font-bold">Available Bays</p>
            <p className="text-3xl font-extrabold font-mono text-emerald-400 mt-1 drop-shadow-md">{availableCount}</p>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">out of {slots.length} bays</p>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl">
            <p className="text-xs text-zinc-300 uppercase tracking-wider font-bold">Reserved Bays</p>
            <p className="text-3xl font-extrabold font-mono text-amber-400 mt-1 drop-shadow-md">{reservedCount}</p>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Pending arrival</p>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl">
            <p className="text-xs text-zinc-300 uppercase tracking-wider font-bold">Occupied Bays</p>
            <p className="text-3xl font-extrabold font-mono text-red-500 mt-1 drop-shadow-md">{occupiedCount}</p>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Active session</p>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl">
            <p className="text-xs text-zinc-300 uppercase tracking-wider font-bold">Base Fee</p>
            <p className="text-3xl font-extrabold font-mono text-white mt-1 drop-shadow-md">₹{currentLocation?.baseRate || 25}<span className="text-xs font-normal">/hr</span></p>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Standard hourly rate</p>
          </div>
        </div>

        {/* Alert Banner */}
        {message && (
          <div className="px-4 py-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-white font-medium flex justify-between items-center shadow-lg backdrop-blur-md">
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="text-zinc-400 hover:text-white font-bold ml-4">Dismiss</button>
          </div>
        )}

        {/* Interactive Slots Layout */}
        <div className="bg-black/40 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Select Parking Bay</h2>
            <div className="flex items-center gap-4 text-[10px] font-mono uppercase text-zinc-300">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span> Available</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block"></span> Reserved</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-600 inline-block"></span> Occupied</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 pt-2">
            {slots.map((slot) => (
              <ParkingSlot
                key={slot._id}
                slot={slot}
                isUserLoggedIn={Boolean(user)}
                onSelect={setSelectedSlot}
              />
            ))}
          </div>
        </div>

        {/* Booking Confirmation Modal */}
        <BookingModal
          slot={selectedSlot}
          onConfirm={handleBookSlot}
          onClose={() => setSelectedSlot(null)}
        />

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