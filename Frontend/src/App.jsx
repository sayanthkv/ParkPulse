import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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

  // Load user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user session", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Home & Public Routes */}
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

        {/* Locations List */}
        <Route
          path="/locations"
          element={<Locations user={user} />}
        />

        {/* Parking Location, Floor & Bay Selector */}
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

        {/* Slot Confirmation & Payment Page */}
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

        {/* Driver Pass Management / My Bookings */}
        <Route
          path="/my-bookings"
          element={<MyBookings user={user} onLogout={handleLogout} />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />}
        />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to={user ? "/locations" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}