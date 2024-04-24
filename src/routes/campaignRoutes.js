const express = require("express");
const router = express.Router();
const campaignService = require("../services/campaignService");
const authService = require("../services/authService");

router
  .route("/")
  .get(campaignService.getAllCampaigns)
  .post(
    authService.protect,
    authService.restrictTo("admin"),
    campaignService.uploadCampaignImages,
    campaignService.resizeCampaignImages,
    campaignService.createCampaign
  );

router
  .route("/:id")
  .get(campaignService.getCampaign)
  .delete(campaignService.deleteCampaign);

module.exports = router;
