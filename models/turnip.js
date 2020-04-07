const mongoose = require("mongoose");

const turnipSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  island: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Island",
    required: true
  }
});

const Turnip = mongoose.model("Turnip", turnipSchema);

module.exports = Turnip;
