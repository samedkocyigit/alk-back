const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product must hava a name"],
  },
  brand: {
    type: String,
    required: [true, "Product must have a brand"],
  },
  price: {
    type: Number,
    required: [true, "Product must have a price"],
  },
  stock_code: {
    type: Number,
    required: [true, "Product must have a stock code"],
  },
  summary: {
    type: String,
    required: [true, "Product must have a summary"],
  },
  manufactorer_code: {
    type: String,
    required: [true, "Product must have a brand"],
  },
  photo: String,
  categories: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
  ],
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "categories",
    select: "-__v ",
  });

  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
