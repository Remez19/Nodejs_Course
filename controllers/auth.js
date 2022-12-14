const { result } = require("lodash");
const User = require("../models/user");
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  /**
   * We can setup any key value by reaching req.session
   */
  // Creating a user before server listen
  User.findById("6397244fa9a920efc142aa74")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      // Make sure that we redirect once we saved the session in the data base
      req.session.save((error) => {
        if (error) {
          console.log(error);
        }
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  /**
   * "destroy()" - a method provided by the session object.
   * The method destroy the session.
   * As an argument we pass a function that will be called once the session
   * is destroyed.
   */
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
    }
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postSignup = (req, res, next) => {
  // Here we want to save a new user to the database
  const { email, password, confirmPassword } = req.body;
  // Validate user input - if the input is valid.
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        // User with the same email already exist
        return res.redirect("/signup");
      }
      // User Not exist!
      const user = new User({
        email: email,
        password: password,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      // Succesfully created new user

      res.redirect("/login");
    })
    .catch((error) => {
      console.log("auth postSignup: " + error);
    });
};
