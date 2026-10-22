const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  slotNumber: { type: String, required: true },
  floor: { type: Number, default: 1 },
  status: { type: String, enum: ['AVAILABLE', 'RESERVED', 'OCCUPIED'], default: 'AVAILABLE' }
}, { timestamps: true });

// 💥 Create a compound unique index: slotNumber is unique ONLY per locationId
SlotSchema.index({ locationId: 1, slotNumber: 1 }, { unique: true });

module.exports = mongoose.model('Slot', SlotSchema);