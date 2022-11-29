const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

/**
 * Helper function:
 * Contructs the path to the file where we store our products and,
 * read the file content (formating it too) and send it to the call back function.
 * the cakkback function gets excuted when we endup reading the file.
 * @param {pointerToFunction} callBack
 */
const getProductsFromFile = (callBack) => {
  fs.readFile(p, (err, fileContent) => {
    if (err || fileContent.length === 0) {
      callBack([]);
    } else {
      callBack(JSON.parse(fileContent));
    }
  });
};

/**
 * Class represent a single product.
 */
module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (product) => product.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        // Creating a unique id for the product before saving it
        // Can be done better than using Math.random()
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProducts = products.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll(callBack) {
    return getProductsFromFile(callBack);
  }
  static getProductById(id, callBack) {
    getProductsFromFile((products) => {
      const resultProduct = products.find((product) => product.id === id);
      callBack(resultProduct);
    });
  }
};
