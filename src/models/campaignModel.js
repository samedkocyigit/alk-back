const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  photos: [String],
  name: {
    type: String,
    require: [true, "Campaign must have a name"],
  },
});

const Campaigns = mongoose.model("Campaigns", campaignSchema);

module.exports = Campaigns;
