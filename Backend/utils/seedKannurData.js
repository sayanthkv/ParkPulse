const Location = require('../models/Location');
const Slot = require('../models/Slot');

const kannurLocations = [
  {
    name: "Kannur Corporation Multi-Level Car Parking",
    address: "Stadium Road, Thavakkara, Kannur",
    description: "6-floor facility built under the AMRUT scheme holding up to 124 cars.",
    capacity: 124,
    baseRate: 50,
    totalFloors: 6
  },
  {
    name: "Kannur Railway Station Parking (East Side)",
    address: "Thavakkara / Talap, Kannur",
    description: "24-hour operational paid parking adjacent to Terminal 2.",
    capacity: 40,
    baseRate: 25,
    totalFloors: 1
  },
  {
    name: "New Bus Stand Car Parking",
    address: "Thavakkara, Kannur",
    description: "Ample paid car parking space adjacent to the main transport hub.",
    capacity: 50,
    baseRate: 30,
    totalFloors: 1
  },
  {
    name: "Ashirvad Car Parking",
    address: "Thavakkara, Kannur",
    description: "24-hour organized parking management with reliable staff support.",
    capacity: 30,
    baseRate: 30,
    totalFloors: 1
  }
];

const seedLocations = async () => {
  try {
    const locationCount = await Location.countDocuments();
    
    // Seed if no locations exist in database
    if (locationCount === 0) {
      console.log('🌱 Seeding Kannur parking hubs...');

      // Clear any orphaned slots from previous builds
      await Slot.deleteMany({});

      // Insert Kannur Locations
      const createdLocations = await Location.insertMany(kannurLocations);
      console.log('✅ Kannur Parking Locations seeded!');

      // Create distinct slots mapped directly to each location's ObjectId
      for (const loc of createdLocations) {
        const slotsToCreate = [];
        
        // Generate a clean location-based prefix (e.g. KANNUR-01, RAILWAY-01, BUS-01, ASHIRVAD-01)
        const prefix = loc.name.split(' ')[0].toUpperCase();

        for (let i = 1; i <= 10; i++) {
          slotsToCreate.push({
            locationId: loc._id, // 👈 Ensures slot isolation per location
            slotNumber: `${prefix}-${i < 10 ? '0' + i : i}`,
            floor: 1,
            status: 'AVAILABLE'
          });
        }

        await Slot.insertMany(slotsToCreate);
      }

      console.log('✅ Location-isolated slots seeded successfully!');
    } else {
      console.log('ℹ️ Kannur parking locations already present in DB.');
    }
  } catch (err) {
    console.error('❌ Error during Kannur data seeding:', err.message);
  }
};

module.exports = seedLocations;