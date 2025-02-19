const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/auth');

// Create a new user
router.post('/', userController.createUser);

// User login
router.post('/login', userController.loginUser);

// Get user details (Authenticated user)
router.get('/:email', authenticate, userController.getUserDetails);

// Assign a program to a user (Admin only)
router.post('/:email/programs', authenticate, authorize(['admin']), userController.assignProgram);

module.exports = router;