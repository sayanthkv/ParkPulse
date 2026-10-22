import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', vehicleNumber: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <h2 style={{ margin: '0 0 8px 0', fontSize: '1.8rem' }}>Create Account</h2>
        <p style={{ color: '#94a3b8', marginTop: 0, marginBottom: '24px' }}>Register your vehicle for instant smart parking</p>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="input-group"><label>Full Name</label><input className="input-field" name="name" type="text" placeholder="Sayanth Sajeevan" onChange={handleChange} required /></div>
          <div className="input-group"><label>Email Address</label><input className="input-field" name="email" type="email" placeholder="sayanth@example.com" onChange={handleChange} required /></div>
          <div className="input-group"><label>Password</label><input className="input-field" name="password" type="password" placeholder="••••••••" onChange={handleChange} required /></div>
          <div className="input-group"><label>Phone Number</label><input className="input-field" name="phone" type="text" placeholder="9876543210" onChange={handleChange} required /></div>
          <div className="input-group"><label>Vehicle Number</label><input className="input-field" name="vehicleNumber" type="text" placeholder="KL-11-AB-1234" onChange={handleChange} required /></div>
          <button className="btn-modern" type="submit">Complete Registration</button>
        </form>

        <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '20px', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '600' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}