const Product = require("../models/product");
exports.getAddProduct = (req, res) => {
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  // products.push({ title: req.body.title });
  const { title, imageUrl, description, price } = req.body;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res) => {
  /**
   * We can extract query params by req.query.PARAM_NAME
   * the returned value is always a string.
   * The params in a url comes after "?"
   * and as a key-value pairs sperated by "&".
   * Example: https://localhost:3000/store?edit=true&page=false
   */
  const editMode = req.query.edit;
  const productId = req.params.productId;
  if (!editMode) {
    return res.redirect("/");
  }
  Product.getProductById(productId, (product) => {
    if (!product) {
      // Not always convinient we need to show the user error
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode === "true",
      product: product,
    });
  });
};

exports.postEditProduct = (req, res) => {
  const productId = req.body.productId;
  const {
    title: updatedTitle,
    price: updatedPrice,
    imageUrl: updatedImageUrl,
    description: updatedDescription,
  } = req.body;
  const updatedProduct = new Product(
    productId,
    updatedTitle,
    updatedImageUrl,
    updatedDescription,
    updatedPrice
  );

  updatedProduct.save();
  res.redirect("/admin/products");
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
