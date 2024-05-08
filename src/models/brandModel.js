const mongoose = require("mongoose");

const brandsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Brand must have a name"],
  },
  photos: [String],
});

const Brand = mongoose.model("Brand", brandsSchema);

module.exports = Brand;
