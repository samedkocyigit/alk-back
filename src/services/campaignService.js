const path = require("path");
const multer = require("multer");
const sharp = require("sharp");

const Campaigns = require("../models/campaignModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const targetDir = path.join(
  __dirname,
  "../../../frontend/public/images/campaigns/"
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

exports.uploadCampaignImages = upload.fields([{ name: "photos", maxCount: 3 }]);

exports.resizeCampaignImages = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.photos) {
    return next(); // Dosya yüklenmemişse veya photos alanı yoksa bir sonraki middleware'e geç
  }

  // 1) Images
  req.body.photos = [];

  await Promise.all(
    req.files.photos.map(async (file, i) => {
      const filename = `campaign-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(1600, 450)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`${targetDir}/${filename}`);

      req.body.photos.push(filename);
    })
  );

  next();
});

exports.createCampaign = catchAsync(async (req, res, next) => {
  const newCampaign = await Campaigns.create(req.body);

  // Eğer base64 formatında fotoğraf varsa
  if (req.body.photos) {
    // Base64 verisini buffer'a çevir
    const imageBuffer = Buffer.from(
      newCampaign.photos[0].replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    // Resmi boyutlandır ve kaydet
    const filename = `campaign-${newCampaign._id}-${Date.now()}.jpeg`;
    await sharp(imageBuffer)
      .resize(1400, 450)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${targetDir}/${filename}`);

    // Oluşturulan dosya ismini veriye ekle
    newCampaign.photos = [];
    newCampaign.photos.push(filename);

    // Ürünü güncelle
    await newCampaign.save();
  }

  res.status(200).json({
    status: "succes",
    data: {
      data: newCampaign,
    },
  });
});

exports.getAllCampaigns = catchAsync(async (req, res, next) => {
  const campaigns = await Campaigns.find();

  if (!campaigns) return next(new AppError("There is no campaign yet"));

  res.status(200).json({
    status: "success",
    requiredAt: campaigns.length,
    data: {
      data: campaigns,
    },
  });
});

exports.getCampaign = catchAsync(async (req, res, next) => {
  const campaign = await Campaigns.find(req.params.id);

  if (!campaign) return next(new AppError("There is no campaign that id"));

  res.status(200).json({
    status: "success",
    data: {
      data: campaign,
    },
  });
});

exports.deleteCampaign = catchAsync(async (req, res, next) => {
  await Campaign.findOneAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      data: null,
    },
  });
});
