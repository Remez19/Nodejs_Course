const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

// Load the login page
router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

// Post request for login
router.post("/login", authController.postLogin);

router.post("/signup", authController.postSignup);

router.post("/logout", authController.postLogout);

module.exports = router;
