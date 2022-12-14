module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    // The user not loogedin
    return res.redirect("/login");
  }
  next();
};
