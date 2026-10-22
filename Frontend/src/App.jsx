import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
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
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}