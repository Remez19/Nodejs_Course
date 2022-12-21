// Helsp us create unique, secure random values
const crypto = require("crypto");

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
require("dotenv").config();

// validationResult - function that allows us to get all
// the errors prior to this middleware
// the function gets a request object as an argument.
const { validationResult } = require("express-validator/check");
const { assert } = require("console");

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
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

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
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Invalid email or password",
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
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
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: "Invalid email or password",
            oldInput: {
              email: email,
              password: password,
            },
            validationErrors: [],
          });
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
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  // Here we want to save a new user to the database
  const { email, password, confirmPassword } = req.body;
  // Validate user input - if the input is valid.
  const errors = validationResult(req);

  // check if we have errors in the user input
  if (!errors.isEmpty()) {
    // 442 comon code for validation fail
    return res.status(442).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }
  /**
   * Hashing the password
   * hash(string_to_hash, salt_value)
   * salt_value - the number of hashing rounds will be applied.
   * 12 rounds consider highly secured.
   * Give back a promise (asyncronios - can chain then).
   */
  bcrypt
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
    })
    .catch((error) => {
      console.log("auth postSignup: " + error);
    });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    // Pulling the value of the key error, after that it will be removed
    // from the session
    errorMessage: message.length > 0 ? message[0] : null,
  });
};

exports.postReset = (req, res, next) => {
  const emailToSendLinkReset = req.body.email;
  let experation = null;
  // Second arg - function to be called once done
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      console.log(error);
      return res.redirect("/reset");
    }
    // Convert hax values to asci values
    // the token should be saved in the database for the user that neeeds it
    // - a user that want to reset his password
    const token = buffer.toString("hex");

    // finding the user (that want to reset password )in the database.
    User.findOne({ email: emailToSendLinkReset })
      .then((user) => {
        if (!user) {
          req.flash(
            "error",
            "No account with that email: " + emailToSendLinkReset
          );
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = experation = Date.now() + 360000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        // The user stored  in the database
        transporter.sendMail({
          to: emailToSendLinkReset,
          from: process.env.EMAIL,
          subject: "Reset Password",
          html: `
            <h1>Password Reset</h1> 
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
            <p>The link will be available until ${Date(
              experation
            ).toString()}.</p>
          `,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  let resetUser;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let message = req.flash("error");
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message.length > 0 ? message[0] : null,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const { newPassword, userId, passwordToken } = req.body;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, saltValue);
    })
    .then((hashPassword) => {
      resetUser.password = hashPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((error) => {
      console.log(error);
    });
};
