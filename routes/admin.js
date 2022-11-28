const express = require("express");
const path = require("path");

const productsController = require("../controllers/products");
/**
 * This Router is like a mini express app
 * plugable into the other express app
 * which we can export.
 */
const router = express.Router();

// Same path can be used for diffrent methods. (POST, GET, PUT)

router.post("/add-product", productsController.postAddProduct);
router.get("/add-product", productsController.getAddProduct);

module.exports = router;
