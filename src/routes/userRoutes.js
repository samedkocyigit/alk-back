const express = require("express");
const userService = require("../services/userService");

const router = express.Router();

router.route("/").get(userService.getAllUsers).post(userService.createOneUser);

router
  .route("/:id")
  .get(userService.getOneUser)
  .patch(userService.updateOneUser)
  .delete(userService.deleteOneUser);

module.exports = router;
