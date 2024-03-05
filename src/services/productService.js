const Product = require("../models/productModel");
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

exports.deleteOne = catchAsync(async (req, res, next) => {
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
exports.getOne = catchAsync(async (req, res, next) => {
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
