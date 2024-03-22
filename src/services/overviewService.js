const Product = require("../models/productModel");

const catchAsync = require("../utils/catchAsync");
const FilterProduct = require("../utils/filter");

exports.getOverview = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  let filter = {};
  if (req.params.productId) filter = { product: req.params.tourId };

  const features = new FilterProduct(Product.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;

  res.status(200).json({
    status: "success",
    requestedAt: doc.length,
    data: {
      data: doc,
    },
  });
});
