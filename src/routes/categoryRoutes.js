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
  .patch(categoryService.updateCategory)
  .delete(categoryService.deleteCategory);

module.exports = router;
