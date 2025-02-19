const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  programName: {
    type: String,
    required: true,
  },
  dailyProgress: [{
    day: { type: Number, required: true },
    activities: [{
      activityId: { type: String, required: true },
      completed: { type: Boolean, default: false },
      completions: {type: Number, default: 0}
    }]
  }]
});

const Progress = mongoose.model("Progress", progressSchema);

module.exports = Progress;