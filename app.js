const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 3000;

const errorController = require("./controllers/error");
// const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

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

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://Remez:FJn55dv7WdyeYQeL@nodejscourse.7vjdhyd.mongodb.net/shop?retryWrites=true&w=majority"
  )
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
