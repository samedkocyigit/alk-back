const path = require("path");
const multer = require("multer");
const sharp = require("sharp");

const catchAsync = require("../utils/catchAsync");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const FilterProduct = require("../utils/filter");

const targetDirCategory = path.join(
  __dirname,
  "../../../frontend/public/images/categories/"
);
const targetDirSubCategory = path.join(
  __dirname,
  "../../../frontend/public/images/categories/subCategories"
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

exports.uploadCategoyImages = upload.fields([{ name: "photos" }]);

exports.resizeCategoryImages = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.photos) return next();

  // 1) Images
  req.body.photos = [];

  await Promise.all(
    req.files.photos.map(async (file, i) => {
      const filename = `category-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize({ width: 240, height: 320, withoutEnlargement: true })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`${targetDirCategory}/${filename}`);

      req.body.photos.push(filename);
    })
  );

  next();
});
exports.uploadSubCategoyImages = upload.fields([{ name: "photos" }]);

exports.resizeSubCategoryImages = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.photos) return next();

  // 1) Images
  req.body.photos = [];

  await Promise.all(
    req.files.photos.map(async (file, i) => {
      const filename = `subCategory-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize({ width: 150, height: 160, withoutEnlargement: true })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`${targetDirSubCategory}/${filename}`);

      req.body.photos.push(filename);
    })
  );

  next();
});

exports.getAllCategory = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  if (!categories) {
    return next(new AppError("No documents found.", 404));
  }

  res.status(200).json({
    status: "success",
    requsetedAt: categories.length,
    data: {
      data: categories,
    },
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);
  const lastSubCate = category.sub_category.pop();

  if (!category) {
    return next(new AppError("Documents could not be create.", 404));
  }
  // Base64 verisini buffer'a çevir
  const imageBuffer = Buffer.from(
    lastSubCate.photos[0].replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  // const imageBufferCategory = Buffer.from(
  //   category.photos.replace(/^data:image\/\w+;base64,/, ""),
  //   "base64"
  // );

  // Resmi boyutlandır ve kaydet
  // const catFileName = `category-${category._id}-${Date.now()}.jpeg`;
  const filename = `subCategory-${lastSubCate._id}-${Date.now()}.jpeg`;
  await sharp(imageBuffer)
    .resize({ width: 150, height: 160, withoutEnlargement: true })
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`${targetDirSubCategory}/${filename}`);

  // await sharp(imageBufferCategory)
  //   .resize({ width: 240, height: 320, withoutEnlargement: true })
  //   .toFormat("jpeg")
  //   .jpeg({ quality: 90 })
  //   .toFile(`${targetDirCategory}/${filename}`);
  // const imageBuffer = Buffer.from(
  //   category.photos[0].replace(/^data:image\/\w+;base64,/, ""),
  //   "base64"
  // );
  // // Resmi boyutlandır ve kaydet
  // const filename = `category-${category._id}-${Date.now()}.jpeg`;
  // await sharp(imageBuffer)
  //   .resize({ width: 240, height: 320, withoutEnlargement: true })
  //   .toFormat("jpeg")
  //   .jpeg({ quality: 90 })
  //   .toFile(`${targetDir}/${filename}`);

  // Oluşturulan dosya ismini veriye ekle
  // category.photos = catFileName;
  // console.log("haliylee", category.photos);
  lastSubCate.photos[0] = filename;
  // Ürünü güncelle
  category.sub_category.shift();
  await category.save();
  await Category.findByIdAndUpdate(
    category._id,
    { $push: { sub_category: lastSubCate } },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: "success",
    data: {
      data: category,
    },
  });
});

exports.getCategory = async (req, res, next) => {
  try {
    // Kategoriyi bulun
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new AppError("There is no document with that Id.", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: category,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getCategoryForProducts = async (req, res, next) => {
  try {
    // Kategoriyi bulun
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new AppError("There is no document with that Id.", 404));
    }

    // Alt kategorileri ve ürünleri filtrelemek için FilterProduct sınıfını kullanın
    const products = Product.find({ categoryId: req.params.id });
    console.log("cate", products);
    const features = new FilterProduct(products, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getCategoryBySlug = async (req, res, next) => {
  // Kategori servisine slug değerini ileterek kategoriyi bul
  const category = await Category.find({ slug: req.params.slug });
  // Eğer kategori bulunamazsa 404 hatası döndür
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  // Kategoriyi request objesine ekleyerek diğer middleware fonksiyonlarına geçiş yap
  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
};

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(new AppError("Documents could not be update.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: category,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError("There is no document with that Id.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: null,
    },
  });
});

exports.updateSubCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("No documents found.", 404));
  }

  const subCategory = category.sub_category.id(req.params.sub_category_id);

  if (!subCategory) {
    return next(new AppError("No Sub Category documents found.", 404));
  }

  Object.keys(req.body).forEach((key) => {
    subCategory[key] = req.body[key];
  });

  await category.save();

  res.status(200).json({
    status: "success",
    data: {
      data: category,
    },
  });
});

exports.addProductAtSubCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("No documents found.", 404));
  }

  const subCategory = category.sub_category.id(req.params.sub_category_id);

  const productId = req.body.sub_product[0]; // req.body içindeki ürün ID'sini al

  // Ürünü bul
  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError("No product found with given ID.", 404));
  }

  product.categoryId = category.id;
  product.subCategoryId = subCategory.id;
  subCategory.sub_product.push(productId);

  await product.save();
  await category.save();

  res.status(200).json({
    status: "success",
    data: {
      data: category,
    },
  });
});

exports.deleteSubCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("No documents found.", 404));
  }

  const subCategory = category.sub_category.id(req.params.sub_category_id);

  if (!subCategory) {
    return next(new AppError("No Sub Category documents found.", 404));
  }

  category.sub_category.pull({ _id: req.params.sub_category_id });

  await category.save();

  res.status(200).json({
    status: "success",
    data: {
      data: null,
    },
  });
});

exports.createSubCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("No documents found.", 404));
  }

  if (req.body.photos) {
    console.log("girdi");
    category.sub_category.push({
      sub_category_name: req.body.sub_category_name,
      photos: req.body.photos,
    });
    console.log("çıktı");

    const newSubCategory = category.sub_category.pop();
    // Base64 verisini buffer'a çevir
    const imageBuffer = Buffer.from(
      newSubCategory.photos[0].replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    // Resmi boyutlandır ve kaydet
    const filename = `subCategory-${newSubCategory._id}-${Date.now()}.jpeg`;
    await sharp(imageBuffer)
      .resize({ width: 150, height: 160, withoutEnlargement: true })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${targetDirSubCategory}/${filename}`);

    newSubCategory.photos = filename;
    console.log("istenilen kategori", newSubCategory);
    console.log("id", req.params.id);
    // await category.save();
    await Category.findByIdAndUpdate(
      req.params.id,
      { $push: { sub_category: newSubCategory } },
      { new: true, runValidators: false }
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      data: category,
    },
  });
});

exports.getProductsUnderSubCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("No documents found.", 404));
  }

  const subCategory = category.sub_category.id(req.params.sub_category_id);

  if (!subCategory) {
    return next(new AppError("No Sub Category documents found.", 404));
  }

  res.status(200).json({
    status: "success",
    requiredAt: subCategory.length,
    data: {
      subCategory,
    },
  });
});
