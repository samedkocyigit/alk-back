const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const product = await Product.find();

  if (!product) {
    return next(new AppError("No document find ", 404));
  }

  res.status(200).json({
    status: "succes",
    requestedAt: product.length,
    data: {
      data: product,
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
