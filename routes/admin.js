const express = require("express");
const path = require("path");
/**
 * This Router is like a mini express app
 * plugable into the other express app
 * which we can export.
 */
const router = express.Router();

// Same path can be used for diffrent methods. (POST, GET, PUT)

router.post("/add-product", (req, res) => {
  //   bodyParser.urlencoded({ extended: false });
  console.log(req.body.title);
  res.redirect("/");
});
router.get("/add-product", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "views", "add-product.html"));
});

module.exports = router;
