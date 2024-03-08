const express = require("express");
const categoryService = require("../services/categoryService");

const router = express.Router();

router
  .route("/")
  .get(categoryService.getAllCategory)
  .post(categoryService.createCategory);

router
  .route("/:id")
  .get(categoryService.getCategory)
  .post(categoryService.createSubCategory)
  .patch(categoryService.updateCategory)
  .delete(categoryService.deleteCategory);

router
  .route("/:id/sub_category/:sub_category_id")
  .get(categoryService.getProductsUnderSubCategory)
  .post(categoryService.addProductAtSubCategory)
  .patch(categoryService.updateSubCategory)
  .delete(categoryService.deleteSubCategory);

module.exports = router;
