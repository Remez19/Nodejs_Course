const User = require("../models/user");
const bcrypt = require("bcryptjs");
const saltValue = 12;
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  /**
   * We can setup any key value by reaching req.session
   */
  // Creating a user before server listen
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      // checks if the password the user entered is the hashed version.
      // return boolean => true or false
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            // password ok
            req.session.isLoggedIn = true;
            req.session.user = user;
            // Make sure that we redirect once we saved the session in the data base
            return req.session.save((error) => {
              console.log(error);
              res.redirect("/");
            });
          }
          res.redirect("/login");
        })
        .catch((error) => {
          console.log("postLogin " + error);
          res.redirect("/login");
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
      // User Not exists
      /**
       * Hashing the password
       * hash(string_to_hash, salt_value)
       * salt_value - the number of hashing rounds will be applied.
       * 12 rounds consider highly secured.
       * Give back a promise (asyncronios - can chain then).
       */
      return bcrypt
        .hash(password, saltValue)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          // Succesfully created new user

          res.redirect("/login");
        });
    })
    .catch((error) => {
      console.log("auth postSignup: " + error);
    });
};
