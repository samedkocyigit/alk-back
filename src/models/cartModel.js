const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  items: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
  ],
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
