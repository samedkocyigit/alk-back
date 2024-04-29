const express = require("express");
const cartService = require("../services/cartService");

const router = express.Router();

router.route("/").post(cartService.createCart);

router
  .route("/:id")
  .get(cartService.getCart)
  .post(cartService.addProductAtCart)
  .delete(cartService.removeProductAtCart);

module.exports = router;
