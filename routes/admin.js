const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
// const isValidProductData = require("../middleware/is");
const { check } = require("express-validator");

const router = express.Router();

// /admin/add-product => GET

// We can add as many handlers we want and request will go
// from left to right
// here the request will go first to isAuth.
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// // /admin/add-product => POST
router.post(
  "/add-product",
  isAuth,
  [
    check("title").isString().isLength({ min: 3 }).trim(),
    check("price").isFloat(),
    check("description").isLength({ min: 5 }).trim(),
  ],

  //   [
  //     check("title").isAlphanumeric().isLength({ min: 3 }),
  //     check("imageUrl").isURL(),
  //     check("price").isFloat(),
  //     check("description").isLength({ min: 5 }),
  //   ],
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  isAuth,
  [
    check("title").isString().isLength({ min: 3 }).trim(),
    check("price").isFloat(),
    check("description").isLength({ min: 5 }).trim(),
  ],
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
