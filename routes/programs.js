const express = require('express');
const router = express.Router();
const programsController = require('../controllers/programsController');
const { authenticate, authorize } = require('../middlewares/auth');

// Create a new program (Admin only)
router.post('/', authenticate, authorize(['admin']), programsController.createProgram);

// Get all programs (Authenticated users)
router.get('/', authenticate, programsController.getAllPrograms);

// Get a specific program by name (Authenticated users)
router.get('/:programName', authenticate, programsController.getProgramByName);

// Update a program (Admin only)
router.put('/:programName', authenticate, authorize(['admin']), programsController.updateProgram);

// Delete a program (Admin only)
router.delete('/:programName', authenticate, authorize(['admin']), programsController.deleteProgram);

module.exports = router;