const mongoose = require("mongoose");

const brandsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Brand must have a name"],
  },
  photo: [String],
});

const Brands = mongoose.model("Brands", brandsSchema);

module.exports = Brands;