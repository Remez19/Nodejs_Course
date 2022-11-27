const express = require("express");

const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  // __dirname - holds the absolute path to this file we working on
  res.sendFile(path.join(__dirname, "../", "views", "shop.html"));
});

module.exports = router;
