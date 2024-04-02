const express = require("express");
const userService = require("../services/userService");
const authService = require("../services/authService");

const router = express.Router();

router.post("/login", authService.login);
router.post("/signup", authService.signUp);
router.get("/logout", authService.logout);

router.post("/forgotPassword", authService.forgotPassword);
router.patch("/resetPassword/:token", authService.resetPassword);

//Protect all routes after this middleware
router.use(authService.protect);

router.get("/me", userService.getMe, userService.getOneUser);
router.patch("/updatePassword", authService.updatePassword);

// only admin access from here
router.use(authService.restrictTo("admin"));

router.route("/").get(userService.getAllUsers).post(userService.createOneUser);

router
  .route("/:id")
  .get(userService.getOneUser)
  .patch(userService.updateOneUser)
  .delete(userService.deleteOneUser);

module.exports = router;
