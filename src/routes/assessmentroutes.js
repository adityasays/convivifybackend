// src/routes/assessmentRoutes.js
const express = require("express");
const router = express.Router();
const { startAssessment, submitAssessment } = require("../controllers/assessmentcontroller");
const auth = require("../middleware/authMiddleware");

router.get("/start", auth, startAssessment);
router.post("/submit", auth, submitAssessment);

module.exports = router;