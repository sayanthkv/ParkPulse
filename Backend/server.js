const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import Models for Startup Cleanup
const Slot = require('./models/Slot');
const Location = require('./models/Location');

// Import Seeder Utility
const seedLocations = require('./utils/seedKannurData');

// Import API Routes
const authRoutes = require('./routes/authRoutes');
const slotRoutes = require('./routes/slotRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/locations', locationRoutes);

// Root Healthcheck Endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: '⚡ ParkPulse Kannur Smart Parking API is running smoothly.' });
});

// Database Connection & Isolated Seeding
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/parkpulse';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Database');

    // Drop legacy global index on slotNumber if it exists
    try {
      await Slot.collection.dropIndex('slotNumber_1');
      console.log('🧹 Dropped legacy global slotNumber index.');
    } catch (e) {
      // Index might already be gone, ignore
    }

    // Clear old data
    await Slot.deleteMany({});
    await Location.deleteMany({});
    console.log('🧹 Cleaned up legacy unlinked slots and locations.');

    // Seed Kannur Parking Hubs & location-isolated slots
    await seedLocations();
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ParkPulse server listening on http://localhost:${PORT}`);
});