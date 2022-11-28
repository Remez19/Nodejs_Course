const express = require("express");
const path = require("path");

const rootDir = require("../util/path");
/**
 * This Router is like a mini express app
 * plugable into the other express app
 * which we can export.
 */
const router = express.Router();

const products = [];
// Same path can be used for diffrent methods. (POST, GET, PUT)

router.post("/add-product", (req, res) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});
router.get("/add-product", (req, res) => {
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
});

exports.routes = router;
exports.products = products;
