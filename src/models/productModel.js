const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const productSchema = new mongoose.Schema(
  {
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
    ratingsAverage: {
      type: Number,
      default: 2,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, //4.66666, 46.66666, 4.7,47
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
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
    category_name: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("comment", {
  ref: "Comment",
  foreignField: "user",
  localField: "_id",
});

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
