const Progress = require('../models/progressModel');
const User = require('../models/userModel');

// Get user progress for a specific program and day
exports.getProgress = async (req, res) => {
  try {
    const { userEmail, programName, day } = req.params;

    const progress = await Progress.findOne({ userEmail, programName });

    if (!progress) {
      return res.status(404).json({
        message: 'Progress not found for this user and program'
      });
    }

    const dailyProgress = progress.dailyProgress.find(dp => dp.day.toString() === day);

    if (!dailyProgress) {
      return res.status(404).json({
        message: 'Progress not found for this day'
      });
    }

    res.json(dailyProgress);
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update user progress for a specific program and day
exports.updateProgress = async (req, res) => {
  try {
    const { userEmail, programName, day } = req.params;
    const { activities } = req.body;

    // Find the user and their program start date
    const user = await User.findOne({ email: userEmail, 'userPrograms.programName': programName });

    if (!user) {
      return res.status(404).json({
        message: 'User or program not found'
      });
    }

    const programAssignment = user.userPrograms.find(p => p.programName === programName);
    const programStartDate = programAssignment.programStartDate;

    // Calculate the current program day
    const today = new Date();
    const currentProgramDay = Math.floor((today - programStartDate) / (1000 * 60 * 60 * 24)) + 1;

    // Validate that the user is updating progress for the current program day
    if (parseInt(day) !== currentProgramDay) {
      return res.status(403).json({
        message: 'You can only update progress for the current program day'
      });
    }

    // Find the progress document
    let progress = await Progress.findOne({ userEmail, programName });

    // If no progress document exists, create one
    if (!progress) {
      progress = new Progress({
        userEmail,
        programName,
        dailyProgress: [],
      });
    }

    // Find the daily progress entry
    let dailyProgress = progress.dailyProgress.find(dp => dp.day.toString() === day);

    // If no daily progress entry exists, create one
    if (!dailyProgress) {
      dailyProgress = {
        day: parseInt(day),
        activities: [],
      };
      progress.dailyProgress.push(dailyProgress);
    }

    // Update the activities' completion status
    activities.forEach(updatedActivity => {
      const activityIndex = dailyProgress.activities.findIndex(a => a.activityId === updatedActivity.activityId);
      if (activityIndex > -1) {
        // Update existing activity
        dailyProgress.activities[activityIndex].completed = updatedActivity.completed;
        dailyProgress.activities[activityIndex].completions = updatedActivity.completions;
      }
      else {
        // Add new activity
        dailyProgress.activities.push({
          activityId: updatedActivity.activityId,
          completed: updatedActivity.completed,
          completions: updatedActivity.completions
        });
      }
    });

    await progress.save();

    res.json(dailyProgress);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message
    });
  }
};