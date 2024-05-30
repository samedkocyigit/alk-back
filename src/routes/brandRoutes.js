const express = require("express");
const brandsService = require("../services/brandService");
const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(brandsService.getAllBrands)
  .post(
    authService.protect,
    authService.restrictTo("admin"),
    brandsService.uploadBrandImages,
    brandsService.resizeBrandImages,
    brandsService.createNewBrand
  );

router
  .route("/:id")
  .get(brandsService.getOneBrand)
  .patch(
    brandsService.uploadBrandImages,
    brandsService.resizeBrandImages,
    brandsService.updateBrand
  )
  .delete(brandsService.deleteBrand);

module.exports = router;
