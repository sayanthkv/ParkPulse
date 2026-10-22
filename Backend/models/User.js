const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    phone: { 
      type: String, 
      required: true 
    },
    vehicleNumber: { 
      type: String, 
      required: true, 
      uppercase: true, 
      trim: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);