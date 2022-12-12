const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userShema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

/**
 * The "methods" key allows us to add our own methods to the
 * schema.
 * the methods must be of type function () {} (not arrow function)
 * for the "this" keyword will refer to the schema.
 */
userShema.methods.addToCart = function (product) {
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
      productId: product._id,
      quantity: newQuantity,
    });
  }

  // Adding field to the product on the fly
  // product.quantity = 1;
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};
userShema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (product) => product.productId.toString() !== productId.toString()
  );
  this.cart.items = updatedCartItems;
  return this.save();
};

userShema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userShema);

// const getDb = require("../util/database").getDb;
// const mongodb = require("mongodb");

// const ObjectId = mongodb.ObjectId;

// class User {
//   constructor(userName, email, cart, id) {
//     this.userName = userName;
//     this.email = email;
//     this.cart = cart; // {items: []}
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addProductToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((cartProduct) => {
//       return cartProduct.productId.toString() === product._id.toString();
//     });

//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       // in case the product is already in the cart
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       // In case it is a new prodcut that is not in the cart.
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     // Adding field to the product on the fly
//     // product.quantity = 1;
//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCartItems() {
//     const db = getDb();
//     // Special mongodb query syntax.
//     // Passing "{}" to _id allows us to use a special mongodb query operators.
//     // "$in" - takes an array of ids
//     const productsIds = this.cart.items.map((product) => product.productId);

//     // gives us a cursor with all the matching products
//     // we tell mongodb - give me all elements where the id is one of the ids in the array.
//     return db
//       .collection("products")
//       .find({ _id: { $in: productsIds } })
//       .toArray()
//       .then((productsInCart) => {
//         return productsInCart.map((product) => {
//           return {
//             ...product,
//             quantity: this.cart.items.find((cartItem) => {
//               return cartItem.productId.toString() === product._id.toString();
//             }).quantity,
//           };
//         });
//       });
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(
//       (product) => product.productId.toString() !== productId.toString()
//     );
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCartItems()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.userName,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         // calearing the database
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     // Give all orders of this user
//     const result = db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) })
//       .toArray();
//     return result;
//   }

//   static findUserById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new ObjectId(userId) })
//       .then((user) => {
//         return user;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
// }

// module.exports = User;
