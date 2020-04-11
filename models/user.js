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
    data: Buffer,
    contentType: String
  },
  friendCode: String,
  island: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Island"
  },
  location: String,
  friends: [{
    type: String
  }],
  hasPicture: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
