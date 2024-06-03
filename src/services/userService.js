const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

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
  const newUser = await User.create(req.body);

  const newCart = await Cart.create({
    userId: newUser._id,
  });

  await User.findByIdAndUpdate(newUser._id, { cart: newCart._id });

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

exports.addAdressToUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $push: { address: req.params.address } },
    { new: true, runValidators: true }
  );

  if (!user) {
    return new AppError("Kullanıcı bulunamadı", 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// exports.updateOneUser = catchAsync(async (req, res, next) => {
//   const userId = req.params.id;
//   const update = req.body;

//   const user = await User.findById(userId);

//   if (!user) {
//     return next(new AppError("No document found with that ID", 404));
//   }

//   // Favori öğe ekleme
//   if (update.$push && update.$push.favoriteItems) {
//     user.favoriteItems.push(update.$push.favoriteItems);
//     delete update.$push.favoriteItems; // Favori öğeyi kullanıcı bilgilerinden kaldır
//   }

//   // Favori öğe çıkarma
//   if (update.$pull && update.$pull.favoriteItems) {
//     user.favoriteItems.pull(update.$pull.favoriteItems);
//     delete update.$pull.favoriteItems; // Favori öğeyi kullanıcı bilgilerinden kaldır
//   }

//   // Kullanıcı bilgilerini güncelle
//   Object.assign(user, update);

//   // Kullanıcıyı kaydet
//   const updatedUser = await user.save();

//   res.status(200).json({
//     status: "success",
//     data: {
//       data: updatedUser,
//     },
//   });
// });
