const express = require("express");
const productSevice = require("../services/productService");

const router = express.Router();

router
  .route("/")
  .get(productSevice.getAllProducts)
  .post(productSevice.createProduct);

router
  .route("/:id")
  .get(productSevice.getOne)
  .post(productSevice.addCategoryAtProduct)
  .patch(productSevice.updateProduct)
  .delete(productSevice.deleteOne);

module.exports = router;
