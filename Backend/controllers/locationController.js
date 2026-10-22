const Location = require('../models/Location');

exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching locations', error: err.message });
  }
};