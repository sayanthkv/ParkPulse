const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  capacity: { type: Number, required: true },
  baseRate: { type: Number, default: 25 },
  totalFloors: { type: Number, default: 1 },
  mapCoordinates: { type: String, default: 'Kannur, Kerala' }
}, { timestamps: true });

module.exports = mongoose.model('Location', LocationSchema);