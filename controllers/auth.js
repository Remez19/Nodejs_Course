const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
require("dotenv").config();

const saltValue = 12;

// A setup to tell nodemailer on how our mails should be sent
// sendGridTransport() - will return a configuration that nodemailer to use sebdGrid
const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    // Pulling the value of the key error, after that it will be removed
    // from the session
    errorMessage: message.length > 0 ? message[0] : null,
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
        // flash error message into our session
        // takes a key value pair.
        // Here the key="error", value="Invalid email or password"
        req.flash("error", "Invalid email or password");
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
          req.flash("error", "Invalid email or password");
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
  let message = req.flash("error");
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message.length > 0 ? message[0] : null,
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
        req.flash("error", "Email exist");
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
          // Send email of successfully signup
          /**
           * sendMail() - gets an object.
           */
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: process.env.EMAIL,
            subject: "Signup succeeded",
            html: "<h1>You Succsesfully signed up</h1>",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log("auth postSignup: " + error);
    });
};
