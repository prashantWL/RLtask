const User = require('../models/userModel');
const Programs = require('../models/programsModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword,
      userPrograms: req.body.userPrograms,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);

  }
  catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// User login
exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        message: 'Authentication failed. User not found.'
      });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Authentication failed. Wrong password.'
      });
    }

    const token = jwt.sign({
      email: user.email
    }, process.env.JWT_SECRET);

    res.status(200).json({
      token,
      user
    });
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get user details
exports.getUserDetails = async (req, res) => {
  try {
    // The authenticate middleware attaches the user to the request object
    const user = await User.findOne({ email: req.user.email }).populate('userPrograms.programName');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json(user);
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Assign a program to a user
exports.assignProgram = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const program = await Programs.findOne({ programName: req.body.programName });

    if (!program) {
      return res.status(404).json({
        message: 'Program not found'
      });
    }

    // Check if the user is already assigned to the program
    const isAlreadyAssigned = user.userPrograms.some(up => up.programName === req.body.programName);

    if (isAlreadyAssigned) {
      return res.status(400).json({
        message: 'Program already assigned to user'
      });
    }

    user.userPrograms.push({
      programName: req.body.programName,
      programStartDate: req.body.programStartDate,
    });

    const updatedUser = await user.save();

    res.json(updatedUser);
  }
  catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};