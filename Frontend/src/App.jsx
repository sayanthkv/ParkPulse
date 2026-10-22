import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './index.css';

function SidebarNav({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/signup') return null;

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="brand-title">
          <div className="brand-dot"></div> ParkPulse OS
        </div>

        <div style={{ marginTop: '32px' }}>
          <Link className={`nav-item ${location.pathname === '/' ? 'active' : ''}`} to="/">
            📊 Control Panel
          </Link>
        </div>
      </div>

      <div>
        {user ? (
          <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '16px' }}>
            <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '600' }}>{user.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{user.vehicleNumber}</div>
            <button className="btn-primary-action" onClick={handleLogout} style={{ padding: '8px', fontSize: '0.8rem', background: '#1e293b' }}>
              Sign Out
            </button>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '16px' }}>
            <Link to="/login" className="btn-primary-action" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginBottom: '8px', padding: '8px', fontSize: '0.85rem' }}>
              Sign In
            </Link>
            <Link to="/signup" style={{ display: 'block', textAlign: 'center', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem' }}>
              Create Account
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  return (
    <Router>
      <div className="app-layout">
        <SidebarNav user={user} setUser={setUser} />
        <main className="main-canvas">
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}