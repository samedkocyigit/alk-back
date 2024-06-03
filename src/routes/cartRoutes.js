const express = require("express");
const cartService = require("../services/cartService");

const router = express.Router();

router.route("/").get(cartService.getAllCarts).post(cartService.createCart);

router.route("/:id").get(cartService.getCart).patch(cartService.updateCartItem);

router.route("/:id/:productid").delete(cartService.deleteProductFromCart);

module.exports = router;
