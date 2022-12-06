const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;

class User {
  constructor(userName, email, cart, id) {
    this.userName = userName;
    this.email = this.email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addProductToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cartProduct) => {
      return cartProduct.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      // in case the product is already in the cart
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      // In case it is a new prodcut that is not in the cart.
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    // Adding field to the product on the fly
    // product.quantity = 1;
    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCartItems() {
    const db = getDb();
    // Special mongodb query syntax.
    // Passing "{}" to _id allows us to use a special mongodb query operators.
    // "$in" - takes an array of ids
    const productsIds = this.cart.items.map((product) => product.productId);

    // gives us a cursor with all the matching products
    // we tell mongodb - give me all elements where the id is one of the ids in the array.
    return db
      .collection("products")
      .find({ _id: { $in: productsIds } })
      .toArray()
      .then((productsInCart) => {
        return productsInCart.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((cartItem) => {
              return cartItem.productId.toString() === product._id.toString();
            }).quantity,
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(
      (product) => product.productId.toString() !== productId.toString()
    );
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    const order = {
      items: this.cart.items,
      user: {
        _id: new ObjectId(this._id),
        name: this.name,
      },
    };
    // When adding an order we add the complete cart.
    return db
      .collection("orders")
      .insertOne(this.cart)
      .then((result) => {
        this.cart = { items: [] };
        // calearing the database
        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    // return db.collection("")
  }

  static findUserById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        return user;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = User;
