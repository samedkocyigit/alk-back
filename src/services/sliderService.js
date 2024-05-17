const path = require("path");
const multer = require("multer");
const sharp = require("sharp");

const Sliders = require("../models/sliderModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { url } = require("inspector");

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
      const photoFilename = `campaign-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      const thumbFilename = `campaign-${req.params.id}-${Date.now()}-${i + 1}-thumb.jpeg`;

      // Ana fotoğrafı kaydet ve boyutlandır
      await sharp(file.buffer)
        .resize(1920, 542) // Slider fotoğraf boyutu
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`${targetDir}/${photoFilename}`);

      // Thumbnail'i kaydet ve boyutlandır
      await sharp(file.buffer)
        .resize(70, 40) // Thumb fotoğraf boyutu
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(`${targetDir}/${thumbFilename}`);

      req.body.photos.push({ url: photoFilename, thumbNail: thumbFilename });
    })
  );

  next();
});

exports.updateCampaign = catchAsync(async (req, res, next) => {
  const updatedSlider = await Sliders.sliderSchema.findById(req.params.id);

  const newPhotos = await Sliders.sliderPhotoSchema.create({
    url: req.body.photos[0],
    thumbNail: req.body.photos[1],
  });

  const newPhotoNames = [];

  const photoBuffer = Buffer.from(
    newPhotos.url.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const thumbBuffer = Buffer.from(
    newPhotos.thumbNail.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const photoFilename = `campaign-${updatedSlider._id}-${Date.now()}-.jpeg`;
  const thumbFilename = `campaign-${updatedSlider._id}-${Date.now()}-thumb.jpeg`;

  // Ana fotoğrafı kaydet
  await sharp(photoBuffer)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`${targetDir}/${photoFilename}`);

  // Thumbnail'i kaydet
  await sharp(thumbBuffer)
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`${targetDir}/${thumbFilename}`);

  // Oluşturulan dosya adlarını yeni diziye ekle
  newPhotoNames.push({ url: photoFilename, thumbNail: thumbFilename });
  newPhotos.url = newPhotoNames[0].url;
  newPhotos.thumbNail = newPhotoNames[0].thumbNail;

  await newPhotos.save();
  await updatedSlider.photos.push(newPhotos._id);
  await updatedSlider.save();

  res.status(201).json({
    status: "success",
    data: {
      data: updatedSlider,
    },
  });
});

exports.createCampaign = catchAsync(async (req, res, next) => {
  const newPhotos = await Sliders.sliderPhotoSchema.create({
    url: req.body.photos[0],
    thumbNail: req.body.photos[1],
  });

  const newPhotoNames = [];

  const photoBuffer = Buffer.from(
    newPhotos.url.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const thumbBuffer = Buffer.from(
    newPhotos.thumbNail.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const newCampaign = await Sliders.sliderSchema.create({
    name: req.body.name,
    photos: newPhotos._id,
  });
  const photoFilename = `campaign-${newCampaign._id}-${Date.now()}-.jpeg`;
  const thumbFilename = `campaign-${newCampaign._id}-${Date.now()}-thumb.jpeg`;

  // Ana fotoğrafı kaydet
  await sharp(photoBuffer)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`${targetDir}/${photoFilename}`);

  // Thumbnail'i kaydet
  await sharp(thumbBuffer)
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`${targetDir}/${thumbFilename}`);

  // Oluşturulan dosya adlarını yeni diziye ekle
  newPhotoNames.push({ url: photoFilename, thumbNail: thumbFilename });
  // Yeni dosya adlarını newCampaign.photos dizisine ekleyin
  newPhotos.url = newPhotoNames[0].url;
  newPhotos.thumbNail = newPhotoNames[0].thumbNail;

  // Kampanya verisini kaydedin
  await newPhotos.save();
  await newCampaign.save();

  res.status(201).json({
    status: "success",
    data: {
      data: newCampaign,
    },
  });
});

exports.getAllCampaigns = catchAsync(async (req, res, next) => {
  const campaigns = await Sliders.sliderSchema.find();

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
  const campaign = await Sliders.find(req.params.id);

  if (!campaign) return next(new AppError("There is no campaign that id"));

  res.status(200).json({
    status: "success",
    data: {
      data: campaign,
    },
  });
});

exports.deleteCampaign = catchAsync(async (req, res, next) => {
  await Sliders.findOneAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      data: null,
    },
  });
});
