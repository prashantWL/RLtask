const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password : {
    type : String,
    required : true
  },
  name : {
    type : String,
    required : true
  },
  type: {
    type: String,
    enum: ["admin", "user"],
    required: true
  },
  userPrograms: [
    {
      programName: {
        type: String,
        ref: "Programs",
      },
      programStartDate: {
        type: Date,
        required: true,
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;