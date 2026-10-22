import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <h2 style={{ margin: '0 0 8px 0', fontSize: '1.8rem' }}>Welcome Back</h2>
        <p style={{ color: '#94a3b8', marginTop: 0, marginBottom: '24px' }}>Sign in to manage your parking slots</p>
        
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input className="input-field" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn-modern" type="submit">Sign In</button>
        </form>

        <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '20px', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '600' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}