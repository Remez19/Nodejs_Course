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
    // const cartProduct = this.cart.items.findIndex((cartProduct) => {
    //   return cartProduct._id === product._id;
    // });

    // Adding field to the product on the fly
    // product.quantity = 1;
    const updatedCart = { items: [{ ...product, quantity: 1 }] };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
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
