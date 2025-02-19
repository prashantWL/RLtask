const mongoose = require("mongoose");

const weeklyActivitySchema = new mongoose.Schema({
  activityId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Athleticism",
      "Boosters",
      "Music",
      "Memory",
      "Creativity",
      "Languages",
      "Logic",
    ],
  },
  activityName: {
    type: String,
    required: true,
  },
  activityFrequency: {
    type: String,
    enum: ["daily", "weekly"],
    required: true,
    days: { type: [Number], required: true, default: [0, 0, 0, 0, 0, 0, 0] }, // 0 for Sunday, 1 for Monday, etc.
    timesPerDay: { type: Number, default: 1 },
  },
  activityTime: {
    // In minutes
    type: Number,
    required: true,
  },
});

const programsSchema = new mongoose.Schema({
  programName: {
    type: String,
    required: true,
    unique: true,
  },
  programLength: {
    // In number of weeks
    type: Number,
    required: true,
  },
 weeklyActivities: {
    type: [
      {
        week: { type: Number, required: true },
        activities: [weeklyActivitySchema],
      },
    ],
    validate: [
      {
        validator: function (value) {
          return value.length <= this.programLength;
        },
        message:
          "The number of weeks in weeklyActivities cannot exceed programLength.",
      },
    ],
  },
});

const Programs = mongoose.model("Programs", programsSchema);

module.exports = Programs;