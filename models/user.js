const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String
  },
  friendCode: String,
  island: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Island"
  },
  location: String,
  friend: []
});

const User = mongoose.model("User", userSchema);

module.exports = User;
