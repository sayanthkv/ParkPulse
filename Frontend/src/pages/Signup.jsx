import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import API from '../api';

export default function Signup({ setUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicleNumber: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', formData);
      localStorage.setItem('parkpulse_token', res.data.token);
      localStorage.setItem('parkpulse_user', JSON.stringify(res.data.user));
      setUser(res.data.user);

      // Redirect back to location selection or booking
      const redirectPath = location.state?.redirectedFrom || '/locations';
      navigate(redirectPath, { state: location.state });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
        <div className="bg-black/50 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl space-y-5">
          
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-red-500/40 bg-black/40 text-[10px] font-mono tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>KANNUR DRIVER REGISTRATION</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
              Register <span className="text-red-500">Vehicle</span>
            </h1>
            <p className="text-xs text-zinc-300 font-semibold drop-shadow-md">
              Create an account to reserve parking bays seamlessly
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-200 font-bold mb-1 drop-shadow-md">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Sayanth Sajeevan"
                className="w-full bg-black/50 border border-white/20 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none transition placeholder:text-zinc-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-200 font-bold mb-1 drop-shadow-md">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="driver@kannur.com"
                  className="w-full bg-black/50 border border-white/20 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none transition placeholder:text-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-200 font-bold mb-1 drop-shadow-md">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full bg-black/50 border border-white/20 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none transition placeholder:text-zinc-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-200 font-bold mb-1 drop-shadow-md">
                  Vehicle Reg. No.
                </label>
                <input
                  type="text"
                  name="vehicleNumber"
                  required
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  placeholder="KL-13-AB-1234"
                  className="w-full bg-black/50 border border-white/20 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none transition placeholder:text-zinc-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-200 font-bold mb-1 drop-shadow-md">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-white/20 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none transition placeholder:text-zinc-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition duration-200 shadow-lg shadow-red-600/40 cursor-pointer mt-2"
            >
              Complete Registration
            </button>
          </form>

          <p className="text-center text-xs text-zinc-300 font-semibold drop-shadow-md pt-1">
            Already registered?{' '}
            <Link to="/login" className="text-red-400 hover:text-red-300 font-bold underline underline-offset-4">
              Sign In
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}