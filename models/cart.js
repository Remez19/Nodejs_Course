const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addProduct(productId, productPrice) {
    /**
     * - Fetch the old or previous cart.
     * - Analyze the cart => find existing product.
     * - add new product / increase quantity
     */
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err && fileContent.length !== 0) {
        // Create Cart
        cart = JSON.parse(fileContent);
      }
      //   Analyze the cart => find existing product.
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === productId
      );
      const existingProduct = cart.products[existingProductIndex];
      //   add new product / increase quantity
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: productId, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (error) => {
        console.log(error);
      });
    });
  }
};
