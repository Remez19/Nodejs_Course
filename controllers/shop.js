require("dotenv").config();
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const fs = require("fs");
const path = require("path");
const stripe = require("stripe")(process.env.StripeKey);

const PDFDocument = require("pdfkit");

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems = 0;

  // Counting the number of products
  Product.find()
    .countDocuments()
    .then((numberOfProducts) => {
      totalItems = numberOfProducts;
      return (
        Product.find() // We can use skip() to skip the first x amount of results
          .skip((page - 1) * ITEMS_PER_PAGE)
          // limit() - limit the amount of data we fetch to the number wew pass
          .limit(ITEMS_PER_PAGE)
      );
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
        currentPage: page,
        csrfToken: req.csrfToken(),
        hasNext: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // Will cause node to jump to a middleware that
      // handle errors
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // Will cause node to jump to a middleware that
      // handle errors
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  // Getting the page we are at
  const page = +req.query.page || 1;
  let totalItems = 0;

  // Counting the number of products
  Product.find()
    .countDocuments()
    .then((numberOfProducts) => {
      totalItems = numberOfProducts;
      return (
        Product.find() // We can use skip() to skip the first x amount of results
          .skip((page - 1) * ITEMS_PER_PAGE)
          // limit() - limit the amount of data we fetch to the number wew pass
          .limit(ITEMS_PER_PAGE)
      );
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        csrfToken: req.csrfToken(),
        hasNext: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // Will cause node to jump to a middleware that
      // handle errors
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  // In order to get the full data of each product in the cart we can use
  // "populate("cart.items.productId")"
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: user.cart.items,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // Will cause node to jump to a middleware that
      // handle errors
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  req.user
    .removeFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // Will cause node to jump to a middleware that
      // handle errors
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  let products;
  let totalSum = 0;
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      products = user.cart.items;
      totalSum = 0;
      products.forEach((product) => {
        totalSum += product.productId.price * product.quantity;
      });
      // To create we can pass object to configure the session
      return stripe.checkout.sessions.create({
        // Which type of payments we accept
        payment_method_types: ["card"],
        // which items will be checked out
        line_items: products.map((product) => {
          return {
            // All the data stripe need
            // name: product.productId.title,
            // description: product.productId.description,
            // images: [],
            // amount: product.productId.price * 100,
            // currency: "usd",
            price_data: {
              currency: "usd",
              unit_amount: product.productId.price * 100,
              product_data: {
                name: product.productId.title,
                description: product.productId.description,
                images: [],
              },
            },
            quantity: product.quantity,
          };
        }),
        mode: "payment",
        // This are urls stripe will redirect the user to once the transaction
        // is finished (success or fail)
        success_url:
          req.protocol + "://" + req.get("host") + "/checkout/success", // reconstructing url => http://
        cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
      });
    })
    .then((session) => {
      res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
        products: products,
        totalSum,
        sessionId: session.id,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // Will cause node to jump to a middleware that
      // handle errors
      return next(error);
    });
};

exports.getCheckoutSuccess = (req, res, next) => {
  // In order to get the full data of each product in the cart we can use
  // "populate("cart.items.productId")"
  User.findById({ _id: req.user._id })
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return {
          // mongoose gives us a special field clled "_doc"
          // with the "..." operator we can pull all the data in the
          // object
          productData: { ...item.productId._doc },
          quantity: item.quantity,
        };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // Will cause node to jump to a middleware that
      // handle errors
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  // In order to get the full data of each product in the cart we can use
  // "populate("cart.items.productId")"
  User.findById({ _id: req.user._id })
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return {
          // mongoose gives us a special field clled "_doc"
          // with the "..." operator we can pull all the data in the
          // object
          productData: { ...item.productId._doc },
          quantity: item.quantity,
        };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // Will cause node to jump to a middleware that
      // handle errors
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // Will cause node to jump to a middleware that
      // handle errors
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  // Check if the user is autherized to download this invoice
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No Order Found"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      // Creates a new pdf document
      // it is also a readable stream
      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      // Allows us to define how this content should be served
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="' + invoiceName + '"'
      );
      // Pipe it to a writeable stream
      // To fs.createWriteStream() - we pass a path to define were to store the file
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      // Adding font size to the text
      // We can pass in an object to define more attributes to the text
      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });
      pdfDoc.text("--------------------------------");
      let totalPrice = 0;
      order.products.forEach((prod) => {
        pdfDoc
          .fontSize(14)
          .text(
            `${prod.productData.title} - ${prod.quantity} x $${prod.productData.price}`
          );
        totalPrice += prod.quantity * prod.productData.price;
      });
      pdfDoc.fontSize(26).text("--------------------------------");
      pdfDoc.font("Courier-Bold").fontSize(20).text("Total Price:", {
        underline: true,
      });
      pdfDoc
        .font("Courier-Bold")
        .fontSize(18)
        .text("$" + totalPrice);
      // Tell node when we are done to writing to this stream
      pdfDoc.end();
    })
    .catch((err) => {
      return next(err);
    });
};
