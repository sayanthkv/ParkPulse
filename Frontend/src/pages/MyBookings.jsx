
import React, { useState, useEffect } from 'react';
import API from '../api';

export default function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [extendingBookingId, setExtendingBookingId] = useState(null);
  const [extraHours, setExtraHours] = useState(1);
  const [message, setMessage] = useState('');

  const fetchUserBookings = async () => {
    try {
      const res = await API.get('/slots/my-bookings'); // We will ensure backend endpoint is mapped
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  useEffect(() => {
    if (user) fetchUserBookings();
  }, [user]);

  const handleExtend = async (bookingId) => {
    try {
      const res = await API.post('/slots/extend', {
        bookingId,
        additionalHours: Number(extraHours)
      });
      setMessage(`✅ ${res.data.message}`);
      setExtendingBookingId(null);
      fetchUserBookings();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Extension failed'}`);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Sign In Required</h2>
        <p className="text-xs text-slate-400">Please log in to view your parking history and active reservations.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">My Reservations</h1>
        <p className="text-xs text-slate-400 mt-1">Manage active sessions and view past parking history</p>
      </div>

      {message && (
        <div className="px-4 py-3 bg-[#131b2a] border border-slate-800 rounded-lg text-xs text-slate-300 flex justify-between items-center">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-slate-500 hover:text-white">Dismiss</button>
        </div>
      )}

      {/* Bookings List */}
      <div className="space-y-3">
        {bookings.length === 0 ? (
          <div className="p-8 text-center bg-[#131b2a] border border-slate-800/80 rounded-xl text-xs text-slate-500">
            No active or past reservations found.
          </div>
        ) : (
          bookings.map((booking) => {
            const isActive = booking.status === 'BOOKED' || booking.status === 'ACTIVE';

            return (
              <div
                key={booking._id}
                className="bg-[#131b2a] border border-slate-800/80 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">
                      Slot {booking.slotId?.slotNumber || 'Reserved'}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      isActive ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Vehicle: <span className="font-mono text-slate-300">{booking.vehicleNumber}</span> • Base Fee: <span className="text-white font-semibold">₹{booking.baseFee}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    End Time: {new Date(booking.endTime).toLocaleString()}
                  </p>
                </div>

                {isActive && (
                  <button
                    onClick={() => setExtendingBookingId(booking._id)}
                    className="text-xs font-medium bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 px-3.5 py-2 rounded-lg transition self-start md:self-auto"
                  >
                    Extend Time
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Extension Modal */}
      {extendingBookingId && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#131b2a] border border-slate-800 rounded-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-bold text-white">Extend Parking Session</h3>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Additional Hours</label>
              <input
                type="number"
                min="1"
                max="6"
                value={extraHours}
                onChange={(e) => setExtraHours(e.target.value)}
                className="w-full bg-[#0b0f17] border border-slate-800 rounded-lg px-3.5 py-2 text-white text-sm outline-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleExtend(extendingBookingId)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-xs transition"
              >
                Confirm Extension
              </button>
              <button
                onClick={() => setExtendingBookingId(null)}
                className="px-4 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}