const path = require("path");
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");

/**
 * Gives us a constructor function which we need to execute and pass the session to
 */
const MongoDBStore = require("connect-mongodb-session")(session);

const port = process.env.PORT;

const errorController = require("./controllers/error");
// const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");

const app = express();

const MONGODB_URI = `mongodb+srv://${process.env.MongodbUser}:${process.env.MongodbPassword}@${process.env.MongodbDataBaseName}.7vjdhyd.mongodb.net/${process.env.MongodbCollectionName}?retryWrites=true&w=majority`;

/**
 *  "uri" - connection string in which database we want to save the data.
 *  "collection" - the collection we want to store it in.
 *  "expires" - when should it be expired (it will be cleaned up automatically by mongodb).
 */
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
/**
 * In the object we pass to "session()" we configure
 * the session.
 *
 * "secret" - used for signing the hash (look more into it)
 * "resave" - if the session should be saved on every response that sent or only when but
 * only if something changed in the session.
 *
 * saveUninitialized - make sure that no session will be saved for a request
 * when it dosent need to be saved (cause nothing was changed about it)
 *
 * "cookie" - configure the cookie.
 */
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    // cookie: {maxAge: }
  })
);

app.use((req, res, next) => {
  User.findById("6397244fa9a920efc142aa74")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    // Creating a user before server listen
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Remez",
          email: "remez@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(port, () => {
      console.log("Connected to Database.");
      console.log(`Server listening on port: ${port}.`);
    });
  })
  .catch((error) => {
    console.log("Failed to Connect to Database");
  });
