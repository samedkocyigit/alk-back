const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Campaign must have a name"],
  },
  photos: [String],
});

const Sliders = mongoose.model("Sliders", sliderSchema);

module.exports = Sliders;
