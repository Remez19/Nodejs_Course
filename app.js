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
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

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

// Init csrf
// We can set some optional values by passing {} to it
// More on the offical docs.
const csrfProtection = csrf();

// A confguration object
// destination - function that controls on where to store the file.
// filename - function that controls how the file should be saved.
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // first value should be error (if we have one) - here null
    // second value is the destination to save the file.
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    // first value is error if we have on
    // second value is the name of the file (how we want to save it)
    cb(null, new Date().toISOString() + " - " + file.originalname);
  },
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const { ResultWithContext } = require("express-validator/src/chain");

// Works only with text - not file uploads
app.use(bodyParser.urlencoded({ extended: false }));
// Telling multer that we expect a single file to be submmited
// and the name of the input is "image"
// We can configure multer by passing an object.
// with the dest keyword we tell multer where to store the data
// Here the files will be stored in "images" folder (root dic of project)
// storage gives us more configuration options then the dest key
app.use(multer({ storage: fileStorage }).single("image"));
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

// After we init the session (important because the csrf will use the session)
app.use(csrfProtection);

// After we init the session !
// Help us flash messages when redirecting!
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

// Tell express that we have data that should be include on every view we render
app.use((req, res, next) => {
  // Allows to set local values that will be passed to the views
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

// Special type of middleware
// Error Handling middleware
// Will fire when calling next() with error
// if we have more than one error-handling middleware
// it will go from top to bottom
app.use((error, req, res, next) => {
  res.redirect("/500");
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(port, () => {
      console.log("Connected to Database.");
      console.log(`Server listening on port: ${port}.`);
    });
  })
  .catch((error) => {
    console.log("Failed to Connect to Database");
  });
