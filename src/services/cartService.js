const Cart = require("../models/cartModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { ObjectId } = require("mongodb");

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

exports.getAllCarts = catchAsync(async (req, res, next) => {
  const cart = await Cart.find();

  if (!cart) {
    return next(new AppError("There is a no document with that Id.", 404));
  }

  res.status(200).json({
    status: "success",
    requiredAt: cart.length,
    data: {
      data: cart,
    },
  });
});

exports.addProductAtCart = catchAsync(async (req, res, next) => {
  const { items } = req.body;
  const cart = await Cart.findById(req.params.id);

  if (Array.isArray(items)) {
    for (const item of items) {
      const existingItem = cart.items.find((cartItem) =>
        cartItem.product.equals(item.product)
      );

      if (existingItem) {
        // Eğer ürün kartta zaten varsa, sadece miktarını artır
        existingItem.quantity += item.quantity;
      } else {
        console.log("else");
        // Eğer ürün kartta yoksa, yeni bir ürün olarak ekle
        cart.items.push({ product: item.product, quantity: item.quantity });
      }
    }
  }

  await cart.save();

  res.status(200).json({
    status: "success",
    data: {
      data: cart,
    },
  });
});

exports.removeProductFromCart = catchAsync(async (req, res, next) => {
  const { items } = req.body;
  const cart = await Cart.findById(req.params.id);

  if (Array.isArray(items)) {
    for (const item of items) {
      const existingItem = cart.items.find((cartItem) =>
        cartItem.product.equals(item.product)
      );

      if (existingItem) {
        // Eğer ürün kartta zaten varsa, sadece miktarını artır
        existingItem.quantity -= item.quantity;
      }
    }
  }

  await cart.save();

  res.status(200).json({
    status: "success",
    data: {
      data: cart,
    },
  });
});

exports.deleteProductFromCart = catchAsync(async (req, res, next) => {
  const cartId = req.params.id;
  const productId = req.params.productid; // Silmek istediğiniz ürünün _id değeri
  console.log("değerler", cartId, productId);

  // Cart koleksiyonunu bul
  const cart = await Cart.findById(cartId);

  // Cart bulunamazsa
  if (!cart) {
    return res.status(404).json({
      status: "error",
      message: "Cart bulunamadı",
    });
  }

  // Ürünün index'ini bul
  const index = cart.items.findIndex(
    (item) => item.product._id.toString() === productId
  );

  // Ürün bulunamazsa
  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: "Ürün bulunamadı",
    });
  }

  // Ürünü çıkar
  cart.items.splice(index, 1);

  // Cart'ı güncelle
  const updatedCart = await cart.save();
  console.log("update", updatedCart);

  res.status(200).json({
    status: "success",
    data: {
      data: updatedCart,
    },
  });
});
