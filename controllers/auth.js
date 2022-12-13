exports.getLogin = (req, res, next) => {
  // Getting the value of "loggedIn" Cookie
  // const isLoggedIn = req.get("Cookie").split("=")[1];
  // console.log(req.get("Cookie"));
  console.log(req.session.isLoggedin);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  /**
   * We can setup any key value by reaching req.session
   */
  req.session.isLoggedin = true;
  res.redirect("/");
};
