const mongoose = require("mongoose");

// Fotoğraflar ve küçük resimler için alt şema
const sliderPhotoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "Photo must have a URL"],
  },
  thumbNail: {
    type: String,
    required: [true, "Photo must have a thumbnail URL"],
  },
});
const SliderPhoto = mongoose.model("SliderPhoto", sliderPhotoSchema);

const sliderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Campaign must have a name"],
  },
  photos: [{ type: mongoose.Schema.ObjectId, ref: "SliderPhoto" }], // photos dizisi içinde photoSchema nesneleri
});

sliderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "photos",
    select: "-__v ",
  });
  next();
});
const Slider = mongoose.model("Slider", sliderSchema);
const Sliders = {
  sliderPhotoSchema: SliderPhoto,
  sliderSchema: Slider,
};
module.exports = Sliders;
