const Product = require("../models/product");
exports.getProducts = (req, res) => {
  /**
   * To pass data into our template as an object
   * with a key name that we can later refer to inside the template file.
   */
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

/**
 * getIndex - sends back the the home page to the user.
 * @param {req} req - the request object.
 * @param {*} res - the response object.
 */
exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res) => {
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
  });
};

exports.getCheckout = (req, res) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.getOrders = (req, res) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Orders",
  });
};
