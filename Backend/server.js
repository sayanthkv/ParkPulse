const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Slot = require('./models/Slot');
const Location = require('./models/Location');
const seedLocations = require('./utils/seedKannurData');

const authRoutes = require('./routes/authRoutes');
const slotRoutes = require('./routes/slotRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/slots', slotRoutes); // 👈 Single mount point
app.use('/api/locations', locationRoutes);

// Healthcheck Endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: '⚡ ParkPulse Kannur Smart Parking API is running.' });
});

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/parkpulse';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Database');

    try {
      await Slot.collection.dropIndex('slotNumber_1');
      console.log('🧹 Dropped legacy global slotNumber index.');
    } catch (e) {
      // Index already dropped
    }

    await Slot.deleteMany({});
    await Location.deleteMany({});
    console.log('🧹 Cleaned up legacy slots and locations.');

    await seedLocations();
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ParkPulse server listening on http://localhost:${PORT}`);
});