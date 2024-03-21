const express = require("express");
const productSevice = require("../services/productService");
const authService = require("../services/authService");
const commentRoutes = require("./commentRoutes");

const router = express.Router();

router.use("/:productId/comment", commentRoutes);

router
  .route("/")
  .get(productSevice.getAllProducts)
  .post(
    authService.protect,
    authService.restrictTo("admin"),
    productSevice.createProduct
  );

router
  .route("/:id")
  .get(productSevice.getProduct)
  .post(productSevice.addCategoryAtProduct)
  .patch(
    authService.protect,
    authService.restrictTo("admin"),
    productSevice.uploadProductImages,
    productSevice.resizeProductImages,
    productSevice.updateProduct
  )
  .delete(
    authService.protect,
    authService.restrictTo("admin"),
    productSevice.deleteProduct
  );

module.exports = router;
