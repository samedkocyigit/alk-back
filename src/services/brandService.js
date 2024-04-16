const path = require("path");
const multer = require("multer");
const sharp = require("sharp");

const catchAsync = require("../utils/catchAsync");
const Brands = require("../models/brandModel");
const AppError = require("../utils/appError");

const targetDir = path.join(
  __dirname,
  "../../../frontend/public/images/brands/"
);

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadBrandImages = upload.fields([{ name: "photo" }]);

exports.resizeBrandImages = catchAsync(async (req, res, next) => {
  if (!req.files.photo) return next();

  // 1) Images
  req.body.photo = [];

  await Promise.all(
    req.files.photo.map(async (file, i) => {
      const filename = `brand-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(180, 180)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`${targetDir}/${filename}`);

      req.body.photo.push(filename);
    })
  );

  next();
});

exports.getAllBrands = catchAsync(async (req, res, err) => {
  const brands = await Brands.find();

  res.status(200).json({
    status: "succes",
    requiredAt: brands.length,
    data: {
      data: brands,
    },
  });
});

exports.createNewBrand = catchAsync(async (req, res, err) => {
  const newBrand = await Brands.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      data: newBrand,
    },
  });
});

exports.getOneBrand = catchAsync(async (req, res, err) => {
  const brand = await Brands.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      data: brand,
    },
  });
});

exports.updateBrand = catchAsync(async (req, res, err) => {
  const brand = await Brands.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: brand,
  });
});
exports.deleteBrand = catchAsync(async (req, res, err) => {
  const brand = await Brands.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});
