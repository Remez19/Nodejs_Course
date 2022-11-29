const express = require("express");
const path = require("path");

const router = express.Router();

const shopController = require("../controllers/shop");

/**
 * Load the view for the "/" path with the help of the controller function
 */
router.get("/", shopController.getIndex);

/**
 * Load the view for the "/products" path with the help of the controller function
 */
router.get("/products", shopController.getProducts);

/**
 * Load the view for the "/cart" path with the help of the controller function
 */
router.get("/cart", shopController.getCart);

/**
 * Load the view for the "/checkout" path with the help of the controller function
 */
router.get("/checkout", shopController.getCheckout);

router.get("/orders", shopController.getOrders);

module.exports = router;
