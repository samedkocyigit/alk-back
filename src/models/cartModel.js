const mongoose = require("mongoose");
const path = require("path");

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
  totalPrice: {
    type: Number,
    default: 0,
  },
});

// Cart belgesi kaydedilmeden önce totalPrice değerini güncelle
cartSchema.pre("save", async function (next) {
  const totalPrice = await this.calculateTotalPrice();
  this.totalPrice = totalPrice;
  next();
});

// totalPrice değerini hesaplamak için fonksiyon
cartSchema.methods.calculateTotalPrice = async function () {
  const Product = mongoose.model("Product"); // Product modelini kullanabilmek için
  let totalPrice = 0;

  // items içindeki ürünlerin fiyatlarını topla
  for (const item of this.items) {
    const product = await Product.findById(item);
    if (product) {
      totalPrice += product.price;
    }
  }

  return totalPrice;
};

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "items",
    select: "-__v ",
  });

  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
