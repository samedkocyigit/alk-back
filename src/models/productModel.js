const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product must hava a name"],
  },
  slug: String,
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

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "categories.sub_category",
    select: "-__v ",
  });

  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
