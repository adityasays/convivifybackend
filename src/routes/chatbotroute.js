// src/routes/chatbotRoutes.js
const express = require("express");
const router = express.Router();
const { sendMessage, getHistory } = require("../controllers/chatbotcontroller");
const auth = require("../middleware/authMiddleware");

router.post("/message", auth, sendMessage);
router.get("/history", auth, getHistory);

module.exports = router;