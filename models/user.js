const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;

class User {
  constructor(userName, email) {
    this.userName = userName;
    this.email = this.email;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
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
