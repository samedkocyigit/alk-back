const express = require("express");
const brandsService = require("../services/brandService");

const router = express.Router();

router
  .route("/")
  .get(brandsService.getAllBrands)
  .post(brandsService.createNewBrand);
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
