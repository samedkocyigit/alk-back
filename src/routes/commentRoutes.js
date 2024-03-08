const express = require("express");
const commentService = require("../services/commentService");
const authService = require("../services/authService");

const router = express.Router({ mergeParams: true });

router.use(authService.protect);

router
  .route("/")
  .get(commentService.getAllComment)
  .post(
    authService.restrictTo("user", "admin"),
    commentService.setProductUserIds,
    commentService.createComment
  );

router
  .route("/:id")
  .get(commentService.getComment)
  .patch(commentService.updateComment)
  .delete(commentService.deleteComment);

module.exports = router;
