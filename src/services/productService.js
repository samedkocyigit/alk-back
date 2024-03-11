const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const FilterProduct = require("../utils/filter");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  let filter = {};
  if (req.params.productId) filter = { product: req.params.tourId };

  const features = new FilterProduct(Product.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;

  res.status(200).json({
    status: "success",
    requestedAt: doc.length,
    data: {
      data: doc,
    },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  if (!newProduct) {
    return next(new AppError("Creation proccces failed ", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: newProduct,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError("Creation proccces failed ", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: null,
    },
  });
});
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("There is no document with that Id.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError("Updates proccces failed ", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: product,
    },
  });
});

exports.addCategoryAtProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found.", 404));
  }

  const categoryId = req.body.sub_category[0]; // Gelen JSON belgesinden kategori ID'sini alın
  console.log(categoryId);

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(new AppError("Category not found.", 404));
  }

  if (!product.categories.includes(category._id)) {
    product.categories.push(category._id);
  }

  await product.save();

  res.status(200).json({
    status: "success",
    data: {
      data: product,
    },
  });
});
