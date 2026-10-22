import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('parkpulse_token');
    localStorage.removeItem('parkpulse_user');
    setUser(null);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-red-600/40 group-hover:scale-105 transition-transform">
            P
          </div>
          <span className="text-xl font-black text-white tracking-wider">
            Park<span className="text-red-500">Pulse</span>
          </span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest">
          <Link
            to="/"
            className={`transition duration-200 drop-shadow-md ${
              isActive('/') ? 'text-red-500 font-bold' : 'text-zinc-200 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            to="/locations"
            className={`transition duration-200 drop-shadow-md ${
              isActive('/locations') ? 'text-red-500 font-bold' : 'text-zinc-200 hover:text-white'
            }`}
          >
            Locations
          </Link>
          {user && (
            <Link
              to="/my-bookings"
              className={`transition duration-200 drop-shadow-md ${
                isActive('/my-bookings') ? 'text-red-500 font-bold' : 'text-zinc-200 hover:text-white'
              }`}
            >
              My Passes
            </Link>
          )}
        </nav>

        {/* Auth Action Buttons */}
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-red-400 font-bold hidden sm:inline drop-shadow-md">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-bold uppercase tracking-wider text-white border border-white/20 hover:border-red-500 hover:bg-red-600/20 px-5 py-2.5 rounded-full transition backdrop-blur-xs cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* 🔑 Sign In Button */}
              <Link
                to="/login"
                className="text-xs font-bold uppercase tracking-widest text-zinc-200 hover:text-white border border-white/20 bg-black/30 hover:bg-black/50 px-5 py-2.5 rounded-full transition duration-200 backdrop-blur-xs drop-shadow-md"
              >
                Sign In
              </Link>

              {/* Primary Book Now Button */}
              <button
                onClick={() => navigate('/locations')}
                className="text-xs font-bold uppercase tracking-widest text-white border border-red-500/80 bg-red-600/80 hover:bg-red-500 px-6 py-2.5 rounded-full transition duration-300 shadow-lg shadow-red-600/40 cursor-pointer"
              >
                Book Now
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}