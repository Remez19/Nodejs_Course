const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

// Load the login page
router.get("/login", authController.getLogin);

// Post request for login
router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

module.exports = router;
