const fs = require("fs");
const path = require("path");

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
  constructor(title, imageUrl, description, price) {
    this.id = this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // Creating a unique id for the product before saving it
    // Can be done better than using Math.random()
    this.id = Math.random().toString();
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
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
