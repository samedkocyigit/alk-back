const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  products: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
  shippingAdress: {
    type: mongoose.Schema.ObjectId,
    ref: "Adress",
  },
  total: Number,
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
