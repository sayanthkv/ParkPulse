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
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-2 bg-[#0b0f17]">
      {/* Left Column: Minimal Brand Copy */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-[#0f172a]/50 border-r border-slate-800/80">
        <div>
          <span className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Enterprise Access</span>
          <h1 className="text-4xl font-bold text-white mt-4 leading-tight">
            Streamlined Smart Parking Operations.
          </h1>
          <p className="text-slate-400 mt-4 text-base leading-relaxed max-w-md">
            Reserve slots in real time, monitor live occupancy telemetry, and experience frictionless gate entry across multi-level facilities.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Automated ANPR gate hardware synchronization
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Proactive 5-minute session extension warnings
          </div>
        </div>

        <p className="text-xs text-slate-600">© 2026 ParkPulse Inc. All rights reserved.</p>
      </div>

      {/* Right Column: Clean Form */}
      <div className="flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign In</h2>
          <p className="text-sm text-slate-400 mt-1 mb-8">Access your driver account and active bookings</p>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Work or Personal Email</label>
              <input
                type="email"
                required
                className="w-full bg-[#131b2a] border border-slate-800 focus:border-blue-500/80 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none transition"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full bg-[#131b2a] border border-slate-800 focus:border-blue-500/80 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-slate-300 hover:text-white font-medium underline underline-offset-4">
              Register vehicle
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}