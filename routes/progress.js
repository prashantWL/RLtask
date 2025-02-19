const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authenticate } = require('../middlewares/auth');

// Get user progress for a specific program and day (Authenticated users)
router.get('/:userEmail/:programName/:day', authenticate, progressController.getProgress);

// Update user progress for a specific program and day (Authenticated users)
router.put('/:userEmail/:programName/:day', authenticate, progressController.updateProgress);

module.exports = router;