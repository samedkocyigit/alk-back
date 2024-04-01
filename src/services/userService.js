const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// exports.getMe = (req, res, next) => {
//   req.params.id = req.user.id;
//   next();
// };
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    requestedAt: users.length,
    data: {
      data: users,
    },
  });
});

exports.getOneUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No document find with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: user,
    },
  });
});

exports.createOneUser = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newUser = await User.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      data: newUser,
    },
  });
});

exports.deleteOneUser = catchAsync(async (req, res, next) => {
  const test = await User.findByIdAndDelete(req.params.id);

  if (!test) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.updateOneUser = catchAsync(async (req, res, next) => {
  const updatedOne = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedOne) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: updatedOne,
    },
  });
});
