import React, { useState, useEffect } from 'react';
import API from '../api';

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
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBook = async () => {
    try {
      const res = await API.post('/slots/book', { 
        slotId: selectedSlot._id, 
        durationHours: Number(duration) 
      });
      setMessage(`✅ ${res.data.message}`);
      setSelectedSlot(null);
      fetchSlots();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Booking failed'}`);
    }
  };

  const occupiedCount = slots.filter(s => s.status === 'OCCUPIED').length;
  const reservedCount = slots.filter(s => s.status === 'RESERVED').length;
  const availableCount = slots.filter(s => s.status === 'AVAILABLE').length;
  const occupancyRate = slots.length > 0 ? Math.round(((occupiedCount + reservedCount) / slots.length) * 100) : 0;

  return (
    <div style={{ width: '100%' }}>
      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Occupancy Rate</div>
          <div className="metric-value">{occupancyRate}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Available Slots</div>
          <div className="metric-value" style={{ color: 'var(--emerald)' }}>{availableCount} / {slots.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Active Reserved</div>
          <div className="metric-value" style={{ color: 'var(--amber)' }}>{reservedCount}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Occupied Bays</div>
          <div className="metric-value" style={{ color: 'var(--rose)' }}>{occupiedCount}</div>
        </div>
      </div>

      {message && (
        <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', padding: '12px 20px', borderRadius: '8px', marginBottom: '24px', color: '#fff' }}>
          {message}
        </div>
      )}

      {/* Parking Floor Canvas */}
      <div className="parking-bay-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>Floor 01 - Main Terminal Parking</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real-time sensor telemetry active</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', fontWeight: '600' }}>
            <span style={{ color: 'var(--emerald)' }}>● AVAILABLE</span>
            <span style={{ color: 'var(--amber)' }}>● RESERVED</span>
            <span style={{ color: 'var(--rose)' }}>● OCCUPIED</span>
          </div>
        </div>

        <div className="parking-grid">
          {slots.map((slot) => (
            <div 
              key={slot._id} 
              className={`parking-slot-card ${slot.status}`}
              onClick={() => slot.status === 'AVAILABLE' && user && setSelectedSlot(slot)}
            >
              <div className="slot-header">
                <span className="slot-id">{slot.slotNumber}</span>
                <span className={`status-pill ${slot.status}`}>{slot.status}</span>
              </div>

              <div style={{ textAlign: 'center', margin: '16px 0' }}>
                {slot.status === 'OCCUPIED' && <span style={{ fontSize: '1.8rem' }}>🚗</span>}
                {slot.status === 'RESERVED' && <span style={{ fontSize: '1.8rem' }}>🔒</span>}
                {slot.status === 'AVAILABLE' && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click to Lock Slot</span>}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Rate: ₹50/hr</span>
                <span>Zone A</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slot Reservation Overlay Panel */}
      {selectedSlot && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="metric-card" style={{ width: '380px', padding: '32px' }}>
            <h3 style={{ margin: '0 0 8px 0' }}>Reserve Slot {selectedSlot.slotNumber}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 20px 0' }}>Confirm parking duration and initiate booking.</p>
            
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Parking Duration (Hours)</label>
              <input className="form-input" type="number" min="1" max="12" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>

            <div style={{ padding: '12px', background: '#0b0f17', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total Estimated Fee: <strong style={{ color: '#fff' }}>₹{duration * 50}</strong>
            </div>

            <button className="btn-primary-action" onClick={handleBook}>Confirm Reservation</button>
            <button onClick={() => setSelectedSlot(null)} style={{ width: '100%', marginTop: '10px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}