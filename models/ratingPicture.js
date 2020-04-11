const mongoose = require("mongoose");

const ratingPictureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: {
    type: String,
    enum: ["outfit", "island"]
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  image: {
    data: Buffer,
    contentType: String
  },
  userId: String
});

const RatingPicture = mongoose.model("RatingPicture", ratingPictureSchema);

module.exports = RatingPicture;