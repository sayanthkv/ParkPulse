const express = require('express');
const router = express.Router();
const { getSlots, bookSlot } = require('../controllers/slotController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route to view live parking grid
router.get('/', getSlots);

// Protected route to book a slot (requires auth token)
router.post('/book', authMiddleware, bookSlot);

module.exports = router;