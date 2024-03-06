const express = require("express");
const catchAsync = require("../utils/catchAsync");
const Category = require("../models/categoryModel");
const AppError = require("../utils/appError");

exports.getAllCategory = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  if (!categories) {
    return next(new AppError("No documents found.", 404));
  }

  res.status(200).json({
    status: "success",
    requsetedAt: categories.length,
    data: {
      data: categories,
    },
  });
});

exports.updateSubCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("No documents found.", 404));
  }

  const subCategory = category.sub_category.id(req.params.sub_category_id);

  if (!subCategory) {
    return next(new AppError("No Sub Category documents found.", 404));
  }

  Object.keys(req.body).forEach((key) => {
    subCategory[key] = req.body[key];
  });

  await category.save();

  res.status(200).json({
    status: "success",
    data: {
      data: category,
    },
  });
});

exports.deleteSubCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("No documents found.", 404));
  }

  const subCategory = category.sub_category.id(req.params.sub_category_id);

  if (!subCategory) {
    return next(new AppError("No Sub Category documents found.", 404));
  }

  category.sub_category.pull({ _id: req.params.sub_category_id });

  await category.save();

  res.status(200).json({
    status: "success",
    data: {
      data: null,
    },
  });
});

exports.createSubCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("No documents found.", 404));
  }

  category.sub_category.push(req.body);
  await category.save();

  res.status(200).json({
    status: "success",
    data: {
      data: category,
    },
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);

  if (!category) {
    return next(new AppError("Documents could not be create.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: category,
    },
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("There is a no document with that Id.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: category,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(new AppError("Documents could not be update.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: category,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError("There is no document with that Id.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: null,
    },
  });
});
