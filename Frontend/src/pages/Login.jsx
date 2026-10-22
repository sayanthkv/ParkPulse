import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import API from '../api';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('parkpulse_token', res.data.token);
      localStorage.setItem('parkpulse_user', JSON.stringify(res.data.user));
      setUser(res.data.user);

      // Redirect back to location or default to locations list
      const redirectPath = location.state?.redirectedFrom || '/locations';
      navigate(redirectPath, { state: location.state });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden flex items-center justify-center pt-24 pb-12 px-6 bg-zinc-950">
      
      {/* 🖼️ BLURRED KANNUR BACKDROP */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-105 blur-sm opacity-90 transition-all duration-300"
        style={{ backgroundImage: `url('/kannur-bg.jpg')` }}
      />

      {/* Dark Overlay Mask */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md my-auto">
        {/* Glass Card */}
        <div className="bg-black/50 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-red-500/40 bg-black/40 text-[10px] font-mono tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>DRIVER PORTAL</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
              Welcome <span className="text-red-500">Back</span>
            </h1>
            <p className="text-xs text-zinc-300 font-semibold drop-shadow-md">
              Sign in to manage your active parking passes in Kannur
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-200 font-bold mb-1.5 drop-shadow-md">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="driver@kannur.com"
                className="w-full bg-black/50 border border-white/20 focus:border-red-500 rounded-xl px-4 py-3 text-white text-xs outline-none transition placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-200 font-bold mb-1.5 drop-shadow-md">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/50 border border-white/20 focus:border-red-500 rounded-xl px-4 py-3 text-white text-xs outline-none transition placeholder:text-zinc-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition duration-200 shadow-lg shadow-red-600/40 cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-xs text-zinc-300 font-semibold drop-shadow-md">
            Don't have an account?{' '}
            <Link to="/signup" className="text-red-400 hover:text-red-300 font-bold underline underline-offset-4">
              Register Vehicle
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}