const Cart = require("../models/cartModel");
const catchAsync = require("../utils/catchAsync");

exports.createCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      data: cart,
    },
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id);

  if (!cart) {
    return next(new AppError("There is a no document with that Id.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: cart,
    },
  });
});

exports.addProductAtCart = catchAsync(async (req, res, next) => {
  const { items } = req.body;
  const cart = await Cart.findById(req.params.id);

  cart.items.push(items);
  await cart.save();

  res.status(200).json({
    status: "success",
    data: {
      data: cart,
    },
  });
});

exports.removeProductAtCart = catchAsync(async (req, res, next) => {
  const removeItem = await Cart.findOneAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});
