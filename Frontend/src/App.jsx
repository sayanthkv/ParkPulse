import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Locations from './pages/Locations';
import Dashboard from './pages/Dashboard';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './index.css';

export default function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('parkpulse_user')) || null
  );

  return (
    <Router>
      <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/booking" element={<Dashboard user={user} />} />
            <Route path="/confirmation" element={<BookingConfirmation />} />
            <Route path="/my-bookings" element={<MyBookings user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}