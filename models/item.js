const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: Number,
  picture: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  hot: Boolean
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
