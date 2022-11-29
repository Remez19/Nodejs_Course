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
 * getProduct - sends back the individual product detail page.
 * @param {object} req
 * @param {object} res
 */
exports.getProduct = (req, res) => {
  /**
   * Express gives us a "params" object in the request body.
   * From the "params" object we can extract our dynamic path data.
   * We named the parameter "productId" in the router -
   * router.get("/products/:productId");
   */
  const prodId = req.params.productId;
  Product.getProductById(prodId, (product) => {
    console.log(product);
  });
  res.redirect("/");
};

/**
 * getIndex - sends back the home page to the user.
 * @param {object} req - the request object.
 * @param {object} res - the response object.
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
