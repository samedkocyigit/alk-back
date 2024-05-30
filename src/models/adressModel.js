const mongoose = require("mongoose");

const adressesSchema = new mongoose.Schema({
  city: String,
  country: String,
  adress1: String,
  adress2: String,
  postal_code: String,
});

const Adress = mongoose.model("Adress", adressesSchema);

module.exports = Adress;
