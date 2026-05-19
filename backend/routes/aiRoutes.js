const express = require('express');
const router = express.Router();
const { analyzeComplaintAPI } = require('../controllers/aiController');
const { auth } = require('../middleware/auth');

// @route   POST /api/ai/analyze
router.post('/analyze', auth, analyzeComplaintAPI);

module.exports = router;
