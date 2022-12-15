const express = require("express");
const { check } = require("express-validator/check");

const authController = require("../controllers/auth");

const router = express.Router();

// Load the login page
router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

// Post request for login
router.post("/login", authController.postLogin);

/**
 * Adding middleware for validating the userr input
 * Check will return a middleware function.
 * check() - gets as an argument name of field
 * we want to check or array of names
 * */
router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Please Enter a Valid E-mail")
    // A custom validator we create
    .custom((value, { req }) => {
      if (value === "test@test.com") {
        throw new Error("This email address is forbiden");
      }
      // if ok return true
      return true;
    }),
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
