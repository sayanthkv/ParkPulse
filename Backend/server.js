const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const slotRoutes = require('./routes/slotRoutes');
const gateRoutes = require('./routes/gateRoutes');
const initCronScheduler = require('./utils/cronScheduler');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/gate', gateRoutes);

app.get('/', (req, res) => {
  res.send('🚗 ParkPulse API Server is running smoothly!');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully [Database: smart_parking]');
    // Start background cron job once database is connected
    initCronScheduler();
  })
  .catch((err) => console.error('❌ MongoDB Atlas connection error:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ParkPulse Server listening on port ${PORT}`);
});