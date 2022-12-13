const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

// Load the login page
router.get("/login", authController.getLogin);

module.exports = router;
