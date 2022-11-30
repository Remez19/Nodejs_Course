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
 * Extracting dynamic data (id) of a product to present its details.
 * We got support from the express router to achive that.
 * We can tell the router there will be a dynamic value by adding
 * ":" and than any name we want.
 * With the name we set we can than get access to the value.
 * If we got two paths that start thew same like:
 * router.get("/products/:productId");
 * router.get("/products/delete");
 * than the order of the middleware functions matter.
 * (express will fire the first one).
 */
router.get("/products/:productId", shopController.getProduct);
/**
 * Load the view for the "/cart" path with the help of the controller function
 */
router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/cart-delete-item", shopController.postCartDeleteProduct);

/**
 * Load the view for the "/checkout" path with the help of the controller function
 */
router.get("/checkout", shopController.getCheckout);

router.get("/orders", shopController.getOrders);

module.exports = router;
