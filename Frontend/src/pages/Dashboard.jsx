import React, { useState, useEffect } from 'react';
import API from '../api';
import MetricCard from '../components/dashboard/MetricCard';
import ParkingSlot from '../components/dashboard/ParkingSlot';
import BookingModal from '../components/dashboard/BookingModal';

export default function Dashboard({ user }) {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [duration, setDuration] = useState(1);
  const [message, setMessage] = useState('');

  const fetchSlots = async () => {
    try {
      const res = await API.get('/slots');
      setSlots(res.data);
    } catch (err) {
      console.error('Failed to fetch slot telemetry:', err);
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 3000);
    return () => clearInterval(interval);
  }, []);

 const handleBookSlot = async (bookingData) => {
  try {
    const res = await API.post('/slots/book', bookingData);
    setMessage(`✅ ${res.data.message}`);
    setSelectedSlot(null);
    fetchSlots();
  } catch (err) {
    setMessage(`❌ ${err.response?.data?.message || 'Booking failed'}`);
  }
};

  const occupiedCount = slots.filter((s) => s.status === 'OCCUPIED').length;
  const reservedCount = slots.filter((s) => s.status === 'RESERVED').length;
  const availableCount = slots.filter((s) => s.status === 'AVAILABLE').length;
  const totalSlots = slots.length;
  const occupancyRate = totalSlots > 0 ? Math.round(((occupiedCount + reservedCount) / totalSlots) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Parking Operations</h1>
          <p className="text-xs text-slate-400 mt-1">Zone A • Level 1 live telemetry</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#131b2a] border border-slate-800/80 px-3.5 py-2 rounded-lg w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{availableCount} of {totalSlots} bays available</span>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Occupancy Rate" value={`${occupancyRate}%`} subtext="Active utilization" />
        <MetricCard label="Available Bays" value={availableCount} valueColor="text-emerald-400" subtext={`out of ${totalSlots}`} />
        <MetricCard label="Reserved Bays" value={reservedCount} valueColor="text-amber-400" subtext="Pending arrival" />
        <MetricCard label="Occupied Bays" value={occupiedCount} valueColor="text-rose-400" subtext="In active session" />
      </div>

      {message && (
        <div className="px-4 py-3 bg-[#131b2a] border border-slate-800 rounded-lg text-xs text-slate-300 flex justify-between items-center">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-slate-500 hover:text-white">Dismiss</button>
        </div>
      )}

      {/* Parking Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
        {slots.map((slot) => (
          <ParkingSlot
            key={slot._id}
            slot={slot}
            isUserLoggedIn={Boolean(user)}
            onSelect={setSelectedSlot}
          />
        ))}
      </div>

      {/* Booking Overlay Sheet */}
      <BookingModal
  slot={selectedSlot}
  onConfirm={handleBookSlot}
  onClose={() => setSelectedSlot(null)}
/>
    </div>
  );
}