const express = require('express');
const router = express.Router();
const { getSlots, bookSlot, extendBooking,getUserBookings } = require('../controllers/slotController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getSlots);
router.post('/book', authMiddleware, bookSlot);
router.post('/extend', authMiddleware, extendBooking);
router.get('/my-bookings', authMiddleware, getUserBookings);

module.exports = router;