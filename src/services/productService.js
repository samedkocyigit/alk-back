const path = require("path");
const multer = require("multer");
const sharp = require("sharp");

const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const FilterProduct = require("../utils/filter");

const targetDir = path.join(
  __dirname,
  "../../../frontend/public/images/products/"
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

exports.uploadProductImages = upload.fields([{ name: "photos", maxCount: 3 }]);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.photos) {
    return next(); // Dosya yüklenmemişse veya photos alanı yoksa bir sonraki middleware'e geç
  }

  // 1) Images
  req.body.photos = [];

  await Promise.all(
    req.files.photos.map(async (file, i) => {
      const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(200, 180)
        .toFormat("jpeg")
        .jpeg({ quality: 99 })
        .toFile(`${targetDir}/${filename}`);

      req.body.photos.push(filename);
    })
  );

  next();
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  // Product.find() metodu ile bir sorgu yapın
  const query = Product.find(); // Örnek sorgu, filtrelemeyi ve diğer işlemleri eklemeyi unutmayın

  // FilterProduct sınıfına geçirin
  const features = new FilterProduct(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Sonuçları alın
  const doc = await features.query;

  // Yanıtı gönderin
  res.status(200).json({
    status: "success",
    requestedAt: doc.length,
    data: {
      data: doc,
    },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  // Ürün oluşturma işlemi
  const newProduct = await Product.create(req.body);

  // Eğer base64 formatında fotoğraf varsa
  if (req.body.photos) {
    // Base64 verisini buffer'a çevir
    const imageBuffer = Buffer.from(
      newProduct.photos[0].replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    // Resmi boyutlandır ve kaydet
    const filename = `product-${newProduct._id}-${Date.now()}.jpeg`;
    await sharp(imageBuffer)
      .resize(200, 180)
      .toFormat("jpeg")
      .jpeg({ quality: 99 })
      .toFile(`${targetDir}/${filename}`);

    const filenametwo = `product-detail-${newProduct._id}-${Date.now()}.jpeg`;
    await sharp(imageBuffer)
      .resize(555, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 99 })
      .toFile(`${targetDir}/${filename}`);

    // Oluşturulan dosya ismini veriye ekle
    newProduct.photos = [];
    newProduct.photos_detail = [];
    newProduct.photos.push(filename);
    newProduct.photos_detail.push(filenametwo);

    const category = await Category.findById(req.body.categoryId);
    const subCategory = category.sub_category.id(req.body.subCategoryId);

    subCategory.sub_product.push(newProduct.id);
    // Ürünü güncelle
    await category.save();
    await newProduct.save();
  }

  res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError("Creation proccces failed ", 404));
  }

  await Category.updateMany(
    { "sub_category.sub_product": req.params.id },
    { $pull: { "sub_category.$.sub_product": req.params.id } }
  );

  res.status(200).json({
    status: "success",
    data: {
      data: null,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("There is no document with that Id.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError("Updates proccces failed ", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: product,
    },
  });
});

exports.addCategoryAtProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found.", 404));
  }

  const categoryId = req.body.sub_category[0]; // Gelen JSON belgesinden kategori ID'sini alın
  console.log(categoryId);

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(new AppError("Category not found.", 404));
  }

  if (!product.categories.includes(category._id)) {
    product.categories.push(category._id);
  }

  await product.save();

  res.status(200).json({
    status: "success",
    data: {
      data: product,
    },
  });
});
