const express = require("express");
const orderService = require("../services/orderService");
const router = express.Router();

router.route("/").get(orderService.getAllOrders).post(orderService.createOrder);

router
  .route("/:id")
  .get(orderService.getOrder)
  .patch(orderService.updateOrder)
  .delete(orderService.deleteOrder);

module.exports = router;
