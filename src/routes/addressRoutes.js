const express = require("express");
const addressService = require("../services/addressService");
const router = express.Router();

router
  .route("/")
  .get(addressService.getAllAddress)
  .post(addressService.createAddress);

router
  .route("/:id")
  .get(addressService.getAddress)
  .patch(addressService.updateAddress)
  .delete(addressService.deleteAddress);

module.exports = router;
