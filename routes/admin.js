const express = require("express");
const path = require("path");

const adminController = require("../controllers/admin");
/**
 * This Router is like a mini express app
 * plugable into the other express app
 * which we can export.
 */
const router = express.Router();

// Same path can be used for diffrent methods. (POST, GET, PUT)

router.post("/add-product", adminController.postAddProduct);

router.get("/add-product", adminController.getAddProduct);

router.get("/products", adminController.getProducts);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.post("/edit-product", adminController.postEditProduct);

router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
