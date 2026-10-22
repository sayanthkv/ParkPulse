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
      localStorage.setItem('parkpulse_token', res.data.token);
      localStorage.setItem('parkpulse_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/locations');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-2 bg-zinc-50">
      {/* Left Column: Kannur Red Heritage Side */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-red-900 via-red-800 to-zinc-950 text-white relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-4">
          <span className="text-xs font-bold text-red-300 uppercase tracking-widest px-3 py-1 bg-red-950/60 border border-red-500/30 rounded-full inline-block">
            Kannur Smart Parking Portal
          </span>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
            Seamless Parking Across the Land of Theyyam.
          </h1>
          <p className="text-red-100/80 text-sm leading-relaxed max-w-md">
            Skip traffic delays near Stadium Road, Railway Terminal 2, and New Bus Stand. Reserve verified parking spots in advance.
          </p>
        </div>

        <div className="relative z-10 space-y-3 border-t border-red-800/60 pt-6">
          <p className="text-xs font-semibold uppercase text-red-300 tracking-wider">Serving Major Kannur Locations</p>
          <div className="flex flex-wrap gap-2 text-[11px] font-medium text-red-100">
            <span className="bg-red-950/80 px-2.5 py-1 rounded-md border border-red-700/50">Stadium Road</span>
            <span className="bg-red-950/80 px-2.5 py-1 rounded-md border border-red-700/50">Railway East Side</span>
            <span className="bg-red-950/80 px-2.5 py-1 rounded-md border border-red-700/50">New Bus Stand</span>
            <span className="bg-red-950/80 px-2.5 py-1 rounded-md border border-red-700/50">Ashirvad Hub</span>
          </div>
        </div>

        <p className="text-xs text-red-300/60 relative z-10">© 2026 ParkPulse Kannur. Crafted for seamless travel.</p>
      </div>

      {/* Right Column: Light Minimal Form */}
      <div className="flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Sign In to Your Account</h2>
            <p className="text-xs text-zinc-500 mt-1">Access active parking reservations across Kannur</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="driver@kannur.com"
                className="w-full bg-white border border-zinc-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg px-3.5 py-2.5 text-zinc-900 text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-zinc-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg px-3.5 py-2.5 text-zinc-900 text-sm outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-xs tracking-wider uppercase transition shadow-sm shadow-red-600/20"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500">
            Need a driver account?{' '}
            <Link to="/signup" className="text-red-600 hover:text-red-700 font-semibold underline underline-offset-4">
              Register vehicle
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}