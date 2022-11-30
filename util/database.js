const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

/**
 * mongoConnect - Function to Connent to mongodb server.
 * @param {Function} callBack - the function to excute once the connent is done.
 */
const mongoConnect = (callBack) => {
  MongoClient.connect(
    // The connection string provided by mongodb website
    "mongodb+srv://Remez:hj0mm0puhT9FUv0b@nodejscourse.7vjdhyd.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("CONNECTED TO MONGODB!");
      callBack(client);
    })
    .catch((error) => {
      // In case of error while trying to connect to the database
      console.log(error);
    });
};

module.exports = mongoConnect;
