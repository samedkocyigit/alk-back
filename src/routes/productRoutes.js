const express = require("express");
const productSevice = require("../services/productService");
const commentRoutes = require("./commentRoutes");

const router = express.Router();

router.use("/:productId/comment", commentRoutes);

router
  .route("/")
  .get(productSevice.getAllProducts)
  .post(productSevice.createProduct);

router
  .route("/:id")
  .get(productSevice.getProduct)
  .post(productSevice.addCategoryAtProduct)
  .patch(productSevice.updateProduct)
  .delete(productSevice.deleteProduct);

module.exports = router;
