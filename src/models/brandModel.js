const mongoose = require("mongoose");
const moment = require("moment-timezone"); // moment-timezone paketini kullanacağız

const brandsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand must have a name"],
    },
    photos: [String],
  },
  {
    timestamps: { currentTime: () => moment().tz("Europe/Istanbul").format() }, // Zaman dilimini ayarladık
  }
);

const Brand = mongoose.model("Brand", brandsSchema);

module.exports = Brand;
