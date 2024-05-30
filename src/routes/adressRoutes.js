const express = require("express");
const adressService = require("../services/adressService");
const router = express.Router();

router
  .route("/")
  .get(adressService.getAllAdress)
  .post(adressService.createAdress);

router
  .route("/:id")
  .get(adressService.getAdress)
  .patch(adressService.updateAdress)
  .delete(adressService.deleteAdress);

module.exports = router;
