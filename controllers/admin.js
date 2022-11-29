const Product = require("../models/product");
exports.getAddProduct = (req, res) => {
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.postAddProduct = (req, res) => {
  // products.push({ title: req.body.title });
  const { title, imageUrl, description, price } = req.body;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
