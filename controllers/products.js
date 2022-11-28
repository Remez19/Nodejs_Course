const products = [];

exports.getAddProduct = (req, res) => {
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.postAddProduct = (req, res) => {
  products.push({ title: req.body.title });
  res.redirect("/");
};

exports.getProducts = (req, res) => {
  // render() - will use the default templating engine

  /**
   * To pass data into our template as an object
   * with a key name that we can later refer to inside the template file.
   */
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    hasProds: products.length > 0,
    activeShop: true,
    activeAddProduct: false,
    productCSS: true,
  });
};
