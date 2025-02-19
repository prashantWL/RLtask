const Programs = require('../models/programsModel');

// Create a new program
exports.createProgram = async (req, res) => {
  try {
    const newProgram = new Programs(req.body);
    const savedProgram = await newProgram.save();

    res.status(201).json(savedProgram);
  }
  catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Get all programs
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Programs.find();

    res.json(programs);
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get a specific program by name
exports.getProgramByName = async (req, res) => {
  try {
    const program = await Programs.findOne({ programName: req.params.programName });

    if (!program) {
      return res.status(404).json({
        message: 'Program not found'
      });
    }

    res.json(program);
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update a program
exports.updateProgram = async (req, res) => {
  try {
    const updatedProgram = await Programs.findOneAndUpdate({
      programName: req.params.programName
    },
    req.body,
    {
      new: true,
      runValidators: true
    });

    if (!updatedProgram) {
      return res.status(404).json({
        message: 'Program not found'
      });
    }

    res.json(updatedProgram);
  }
  catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Delete a program
exports.deleteProgram = async (req, res) => {
  try {
    const deletedProgram = await Programs.findOneAndDelete({ programName: req.params.programName });

    if (!deletedProgram) {
      return res.status(404).json({
        message: 'Program not found'
      });
    }

    res.json({ message: 'Program deleted' });
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};