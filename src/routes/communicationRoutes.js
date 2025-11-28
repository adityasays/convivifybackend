const express = require('express');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

// Placeholder for HTTP-based initiation if needed (e.g., get room ID)
// Real-time handled via Socket.io in server.js
router.get('/startChat', protect, (req, res) => {
  const roomId = `room_${Date.now()}`; // Generate room ID
  res.json({ roomId });
});

module.exports = router;