const mongoose = require("mongoose")

const islandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  fruit: {
    type: String,
    required: true
  },
  villagers: [{}],
  turnipPrice: Number,
  hemisphere: {
  	type: String,
  	enum: ["northern", "southern"]
  }
})

const Island = mongoose.model("Island", islandSchema)

module.exports = Island
