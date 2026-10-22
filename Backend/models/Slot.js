const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    slotNumber: { 
      type: String, 
      required: true, 
      unique: true, 
      uppercase: true 
    }, // e.g., "A-01", "A-02"
    floor: { 
      type: Number, 
      default: 1 
    },
    status: { 
      type: String, 
      enum: ['AVAILABLE', 'RESERVED', 'OCCUPIED'], 
      default: 'AVAILABLE' 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Slot', slotSchema);