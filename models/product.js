const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * In the object we passing to the Schema({})
 * we describe how our schema should look like.
 * blueprint.
 * we need to specify the type of the field too.
 *
 * A description of how product should look like in our application
 */
const productSchema = new Schema({
  /**
   * We can just do: title: String,
   * Other way of declaring the title field and inforcing
   * that when we insert it has to be with a value is:
   * title: {
   * type: String,
   * required: true,
   * }
   */
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

// mongoose.model() - Connects a schema with a name
module.exports = mongoose.model("Product", productSchema);

// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     console.log();
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }
//   save() {
//     const dataBase = getDb();
//     let dbOp;
//     if (this._id) {
//       // Update the product
//       /**
//        * To update a product using mongodb we can use:
//        * updateOne({filter_object}, {$set:{}) - with $set: we can tell mongodb which
//        * fields to edit (title or price). with "this" we tell mongodb to
//        * update all the fields.
//        * if we want to update more than one we can use:
//        * updateMany({filter_object}, {$set:{}) -
//        */
//       dbOp = dataBase
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       // Insert the product.
//       /**
//        * We can insert data into the collection by:
//        * insertOne() - Receives an js object.
//        * insertMany() - Receives an array of js objects.
//        *
//        * return a promise - we can use than and catch.
//        */
//       dbOp = dataBase.collection("products").insertOne(this);
//     }
//     return dbOp
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
//   static fetchAll() {
//     const dataBase = getDb();
//     /**
//      * To serach for item we can use find().
//      * The find() method gets a filter object.
//      * find({title: "A book"}) - will find all records with the title book.
//      * More info on the offical docs.
//      * find return a so called cursor object. with the cursor object
//      * we can go over the fatched data.
//      * the reason behind it is that collection can have alot of data
//      * therefor fetching all the data at once can be too much.
//      * We can use toArray() we can call on find.
//      * With toArray() we tell mongodb that we want to get all the documents
//      * and it will turn them to a js array.
//      * We can use this when we know there are small amount of documents.
//      */
//     return dataBase
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         // console.log(products);
//         return products;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
//   /**
//    *  find() - will still return a cursor (even if we have only one item) but we
//    * can call next() to get the next document which in this case is
//    * the last one as well.
//    * Mongodb stores the id in special format (kind of a object), so
//    * we cant compare the default string value of the productId to
//    * the id that mongostores.
//    * Therefor we need mongodb.ObjectId(productId).
//    * @param {string} productId - id of a product.
//    * @returns the product with the id "productId"
//    */
//   static findProductById(productId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new mongodb.ObjectId(productId) })
//       .next()
//       .then((product) => {
//         // console.log(product);
//         return product;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
//   /**
//    * deleteById gets a product id and delete it from the database.
//    * For deleting a product from the database we can use:
//    * deleteOne({fliter}) - deletes one record from the dtabase.
//    * (deletes the first record that fullfill the filter)
//    * deleteMany({fliter}) - deletes more than one record
//    * @param {int} productId
//    */
//   static deleteById(productId) {
//     const dataBaseCon = getDb();
//     return dataBaseCon
//       .collection("products")
//       .deleteOne({ _id: mongodb.ObjectId(productId) })
//       .then((result) => {
//         console.log(`Deleted item with id:${productId} from db successfully`);
//       })
//       .catch((error) => {
//         console.log("product.js deleteById(productId)");
//         console.log(error);
//       });
//   }
// }

// // const Product = sequelize.define("product", {
// //   id: {
// //     type: Sequelize.INTEGER,
// //     autoIncrement: true,
// //     allowNull: false,
// //     primaryKey: true,
// //   },
// //   title: Sequelize.STRING,
// //   price: {
// //     type: Sequelize.DOUBLE,
// //     allowNull: false,
// //   },
// //   imageUrl: {
// //     type: Sequelize.STRING,
// //     allowNull: false,
// //   },
// //   description: {
// //     type: Sequelize.STRING,
// //     allowNull: false,
// //   },
// // });

// module.exports = Product;
