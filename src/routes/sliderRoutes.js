const express = require("express");
const router = express.Router();
const sliderService = require("../services/sliderService");
const authService = require("../services/authService");

router
  .route("/")
  .get(sliderService.getAllCampaigns)
  .post(
    authService.protect,
    authService.restrictTo("admin"),
    sliderService.uploadCampaignImages,
    sliderService.resizeCampaignImages,
    sliderService.createCampaign
  );

router
  .route("/:id")
  .get(sliderService.getCampaign)
  .patch(sliderService.updateCampaign)
  .delete(sliderService.deleteCampaign);

module.exports = router;
