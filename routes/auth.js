const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");
const User = require("../models/user");
const router = express.Router();

// Load the login page
router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

// Post request for login
router.post(
  "/login",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("password")
    .isAlphanumeric()
    .custom((value, { req }) => {
      if (value.length < 5) {
        throw new Error("Password too short (at least 6 characters)");
      }
      return true;
    })
    .trim(),
  authController.postLogin
);

/**
 * Adding middleware for validating the userr input
 * Check will return a middleware function.
 * check() - gets as an argument name of field
 * we want to check or array of names
 *
 * */
router.post(
  "/signup",
  [
    // We can put all our checks in array (not have to)
    check("email")
      .isEmail()
      .withMessage("Please Enter a Valid E-mail")
      // A custom validator we create
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email address is forbiden");
        // }
        // // if ok return true
        // return true;
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            // User with the same email already exist
            return Promise.reject("Email exist");
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      //   Default error message for every check
      "Please enter password that contains only numbers and text at least 5 and lower than 20"
    )
      .isAlphanumeric()
      .isLength({ min: 5, max: 20 })
      .trim(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        console.log("Remez");
        throw new Error("Passwords not match!");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
