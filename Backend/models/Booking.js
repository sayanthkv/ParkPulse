const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    slotId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Slot', 
      required: true 
    },
    vehicleNumber: { 
      type: String, 
      required: true, 
      uppercase: true 
    },
    startTime: { 
      type: Date, 
      required: true 
    },
    endTime: { 
      type: Date, 
      required: true 
    },
    actualEntryTime: { 
      type: Date 
    },
    actualExitTime: { 
      type: Date 
    },
    baseFee: { 
      type: Number, 
      required: true 
    },
    penaltyFee: { 
      type: Number, 
      default: 0 
    },
    status: { 
      type: String, 
      enum: ['BOOKED', 'ACTIVE', 'COMPLETED', 'CANCELLED'], 
      default: 'BOOKED' 
    },
    reminderSent: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);