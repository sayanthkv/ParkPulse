import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Locations from './pages/Locations';
import Dashboard from './pages/Dashboard';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Signup from './pages/Signup';

export default function App() {
  const [user, setUser] = useState(() => {
    // Restore user from localStorage immediately on first render
    const savedUser = localStorage.getItem('parkpulse_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-zinc-950 font-sans antialiased text-white">
        <Navbar user={user} setUser={setUser} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/locations" element={<Locations user={user} />} />
            <Route path="/booking" element={<Dashboard user={user} />} />
            <Route path="/confirmation" element={<BookingConfirmation />} />
            <Route path="/my-bookings" element={<MyBookings user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}