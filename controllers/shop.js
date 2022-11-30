const Product = require("../models/product");
const Cart = require("../models/cart");
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
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  });
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
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartPrtoducts = [];
      for (const product of products) {
        const cartProductData = cart.products.find(
          (cartProduct) => cartProduct.id === product.id
        );
        if (cartProductData !== undefined) {
          cartPrtoducts.push({
            productData: product,
            quantity: cartProductData.quantity,
          });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartPrtoducts,
      });
    });
  });
};

exports.postCart = (req, res) => {
  // We could have got all the product info from the request and not
  // only the id.
  const productId = req.body.productId;
  //  Getting the product data (we need price)
  Product.getProductById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  Product.getProductById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect("/cart");
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
