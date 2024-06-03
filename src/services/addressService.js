const Address = require("../models/addressModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllAddress = catchAsync(async (req, res, next) => {
  const addresses = await Address.find();
  if (!addresses) {
    return new AppError("There no document this model", 400);
  }

  res.status(200).json({
    status: "success",
    requiredAt: addresses.length,
    data: {
      data: addresses,
    },
  });
});

exports.createAddress = catchAsync(async (req, res, next) => {
  const newAddress = await Address.create(req.body);

  if (!newAddress) {
    return new AppError("creation failed");
  }
  console.log("newadress", newAddress);
  res.status(200).json({
    status: "success",
    data: {
      data: newAddress,
    },
  });
});

exports.getAddress = catchAsync(async (req, res, next) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return new AppError("No document with that id", 400);
  }

  res.status(200).json({
    status: "success",
    data: {
      data: address,
    },
  });
});

exports.updateAddress = catchAsync(async (req, res, next) => {
  const updatedAddress = await Address.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedAdress) {
    return new AppError("Update Failed", 400);
  }

  res.status(200).json({
    status: "success",
    data: {
      data: updatedAddress,
    },
  });
});

exports.deleteAddress = catchAsync(async (req, res, next) => {
  const deletedAddress = await Address.findByIdAndDelete(req.params.id);

  if (!deletedAddress) {
    return new AppError("Deletion Failed", 400);
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});
