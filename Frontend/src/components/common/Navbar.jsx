import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('parkpulse_token');
    localStorage.removeItem('parkpulse_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="bg-[#0b0f17] border-b border-slate-800/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Minimalist Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
          <span className="text-base font-semibold text-white tracking-tight">ParkPulse</span>
        </Link>

        {/* User Status or Auth Options */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-medium text-white">{user.name}</p>
                <p className="text-[11px] font-mono text-slate-500">{user.vehicleNumber}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-md transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-xs font-medium text-slate-400 hover:text-white transition">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-md transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}