const Adress = require("../models/adressModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllAdress = catchAsync(async (req, res, next) => {
  const adresses = await Adress.find();
  if (!adresses) {
    return new AppError("There no document this model", 400);
  }

  res.status(200).json({
    status: "success",
    requiredAt: adresses.length,
    data: {
      data: adresses,
    },
  });
});

exports.createAdress = catchAsync(async (req, res, next) => {
  const newAdress = Adress.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      data: newAdress,
    },
  });
});

exports.getAdress = catchAsync(async (req, res, next) => {
  const adress = await Adress.findById(req.params.id);

  if (!adress) {
    return new AppError("No document with that id", 400);
  }

  res.status(200).json({
    status: "success",
    data: {
      data: adress,
    },
  });
});

exports.updateAdress = catchAsync(async (req, res, next) => {
  const updatedAdress = await Adress.findByIdAndUpdate(
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
      data: updatedAdress,
    },
  });
});

exports.deleteAdress = catchAsync(async (req, res, next) => {
  const deletedAdress = await Adress.findByIdAndDelete(req.params.id);

  if (!deletedAdress) {
    return new AppError("Deletion Failed", 400);
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});
