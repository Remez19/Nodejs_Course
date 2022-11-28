const express = require("express");
const path = require("path");

const rootDir = require("../util/path");

const router = express.Router();

const adminData = require("./admin");

router.get("/", (req, res) => {
  // __dirname - holds the absolute path to this file we working on
  console.log(adminData.products);
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
