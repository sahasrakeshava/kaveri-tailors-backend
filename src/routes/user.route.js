const express = require("express");
const passport = require("passport"); // Import passport for Google OAuth
const router = express.Router();
const userController = require("../controller/user.controller.js");

// Normal user-related routes
router.get("/profile", userController.getUserProfile);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);

// Google OAuth2 routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    //successRedirect: "http://localhost:3000/",
  }),
  userController.handleGoogleCallback
);

module.exports = router;
