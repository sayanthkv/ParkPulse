import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import AuthLayout from '../components/auth/AuthLayout';
import FormInput from '../components/common/FormInput';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicleNumber: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout
      badgeText="Driver Registration"
      heroText="Register your vehicle for automated ANPR gate access."
      title="Create Account"
      subtitle="Enter details to setup smart parking credentials"
    >
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <FormInput
          label="Full Name"
          name="name"
          placeholder="e.g. Sayanth Sajeevan"
          onChange={handleChange}
        />
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="e.g. name@company.com"
          onChange={handleChange}
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          placeholder="Enter a strong password"
          autoComplete="new-password"
          onChange={handleChange}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Phone Number"
            name="phone"
            placeholder="e.g. 9876543210"
            onChange={handleChange}
          />
          <FormInput
            label="Vehicle Number"
            name="vehicleNumber"
            placeholder="e.g. KL-11-AB-1234"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg text-xs tracking-wider uppercase transition shadow-md shadow-blue-600/20"
        >
          Complete Registration
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Already registered?{' '}
        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}