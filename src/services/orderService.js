const Order = require("../models/orderModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();

  if (!orders) {
    return new AppError("Find no document in Order model");
  }

  res.status(200).json({
    status: "success",
    requiredAt: orders.length,
    data: {
      data: orders,
    },
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return new AppError("No document with that id", 400);
  }

  res.status(200).json({
    status: "success",
    data: { data: order },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const { user, address, cart } = req.body;
  const newOrder = await Order.create({
    user: user,
    address: address,
    cart: cart,
  });

  if (!newOrder) {
    return next(new AppError("Creation failed", 400));
  }
  const userUpdateResponse = await User.findByIdAndUpdate(
    user,
    { $push: { orders: newOrder._id } },
    { new: true, runValidators: true }
  );

  if (!userUpdateResponse) {
    return next(new AppError("User update failed", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: newOrder,
    },
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedOrder) {
    return new AppError("fail updated", 400);
  }

  res.status(200).json({
    status: "success",
    data: {
      data: updatedOrder,
    },
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const deletedOrder = await Order.findByIdAndUpdate(req.params.id);

  if (!deletedOrder) {
    return new AppError("Deletion failed", 400);
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});
