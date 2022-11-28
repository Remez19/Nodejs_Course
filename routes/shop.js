const express = require("express");
const path = require("path");

const rootDir = require("../util/path");

const router = express.Router();

const adminData = require("./admin");

router.get("/", (req, res) => {
  // render() - will use the default templating engine
  const products = adminData.products;
  /**
   * To pass data into our template as an object
   * with a key name that we can later refer to inside the template file.
   */
  res.render("shop", { prods: products, docTitle: "Shop", path: "/" });
});

module.exports = router;
