const express = require("express");
const path = require("path");

const rootDir = require("../util/path");

const router = express.Router();

const adminData = require("./admin");

router.get("/", (req, res) => {
  // render() - will use the default templating engine
  res.render("shop");
});

module.exports = router;
