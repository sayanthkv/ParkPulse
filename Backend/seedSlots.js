const mongoose = require('mongoose');
const Slot = require('./models/Slot');
require('dotenv').config();

const seedSlots = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Atlas for seeding...');

    // Clear existing slots to start fresh
    await Slot.deleteMany({});

    const slots = [];
    for (let i = 1; i <= 10; i++) {
      slots.push({
        slotNumber: `A-${i < 10 ? '0' + i : i}`,
        floor: 1,
        status: 'AVAILABLE'
      });
    }

    await Slot.insertMany(slots);
    console.log('✅ Successfully created 10 parking slots (A-01 to A-10)!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedSlots();