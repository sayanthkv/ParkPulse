import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/common/Navbar";

// Auth & Base Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Parking System Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Locations from "./pages/Locations";
import ParkingSelection from "./pages/ParkingSelection";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedBookingData, setSelectedBookingData] = useState(null);

  // Restore user session on mount/refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("parkpulse_user");
    const storedToken = localStorage.getItem("parkpulse_token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user session:", err);
        localStorage.removeItem("parkpulse_user");
        localStorage.removeItem("parkpulse_token");
      }
    }
  }, []);

  return (
    <Router>
      {/* Global Navigation Bar */}
      <Navbar user={user} setUser={setUser} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home user={user} />} />
        
        <Route
          path="/login"
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/locations" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Signup setUser={setUser} /> : <Navigate to="/locations" replace />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup setUser={setUser} /> : <Navigate to="/locations" replace />}
        />

        {/* Locations Overview */}
        <Route path="/locations" element={<Locations user={user} />} />

        {/* Floor & Bay Slot Selector */}
        <Route
          path="/parking-selection"
          element={
            user ? (
              <ParkingSelection
                user={user}
                onProceedToConfirm={(bookingPayload) => {
                  setSelectedBookingData(bookingPayload);
                }}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Pass Confirmation Page */}
        <Route
          path="/confirm"
          element={
            user ? (
              <BookingConfirmation
                user={user}
                bookingData={selectedBookingData}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Driver Passes / My Bookings */}
        <Route
          path="/my-bookings"
          element={user ? <MyBookings user={user} /> : <Navigate to="/login" replace />}
        />

        {/* Admin/User Dashboard */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />}
        />

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to={user ? "/locations" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}