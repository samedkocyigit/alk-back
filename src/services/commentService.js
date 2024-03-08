const Comment = require("../models/commentModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.setProductUserIds = (req, res, next) => {
  // Allow nested routes

  console.log("-------------------------------");
  console.log(req.params);
  console.log(req.user.id);
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllComment = catchAsync(async (req, res, next) => {
  const comments = await Comment.find();

  if (!comments) {
    return next(new AppError("No Comments found", 404));
  }

  res.status(200).json({
    status: "success",
    requiredAt: comments.length,
    data: {
      comments,
    },
  });
});

exports.getComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError("There is no comment with that Id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: comment,
    },
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.create(req.body);

  if (!comment) {
    return next(new AppError("Comment could not create", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: comment,
    },
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!comment) {
    return next(new AppError("There is no comment with that Id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      comment,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);

  if (!comment) {
    return next(new AppError("There is no comment with that Id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: null,
    },
  });
});
