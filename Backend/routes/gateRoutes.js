const express = require('express');
const router = express.Router();
const { handleGateEntry, handleGateExit } = require('../controllers/gateController');

// Simulator endpoints (public/internal triggers for gate hardware)
router.post('/entry', handleGateEntry);
router.post('/exit', handleGateExit);

module.exports = router;