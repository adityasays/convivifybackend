const express = require('express');
const { submitEvaluation, getEvaluation } = require('../controllers/evaluationController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, submitEvaluation);
router.get('/', protect, getEvaluation);

module.exports = router;