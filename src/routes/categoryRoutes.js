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
  .post(
    categoryService.uploadSubCategoyImages,
    categoryService.resizeSubCategoryImages,
    categoryService.createSubCategory
  )
  .patch(categoryService.updateCategory)
  .put(categoryService.putFilterAtCategory)
  .delete(categoryService.deleteCategory);

router
  .route("/:id/filters/:filterId")
  .delete(categoryService.removeFilterFromCategory);

router.route("/for-products/:id").get(categoryService.getCategoryForProducts);

router.route("/slug/:slug").get(categoryService.getCategoryBySlug);

router
  .route("/subcategoryslug/:slug")
  .get(categoryService.getSubCategoryBySlug);

router
  .route("/:id/sub_category/:sub_category_id")
  .get(categoryService.getSubCategoryUnderCategory)
  .post(categoryService.addProductAtSubCategory)
  .patch(categoryService.updateSubCategory)
  .delete(categoryService.deleteSubCategory);

router
  .route("/for-products/:id/sub_category/:sub_category_id")
  .get(categoryService.getProductsUnderSubCategory);
module.exports = router;
