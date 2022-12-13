exports.getLogin = (req, res, next) => {
  // Getting the value of "loggedIn" Cookie
  const isLoggedIn = req.get("Cookie").split("=")[1];
  console.log(req.get("Cookie"));
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  /**
   * Setting up a cookie with a header.
   * The "Set-Cookie" is a reserved name we can use to set up a cookie.
   * A cookie in its simplest form is a key-value pair.
   * The browser send the cookie by default on every request we make.
   */
  res.setHeader("Set-Cookie", "loggedIn=true");
  req.isLoggedIn = true;
  res.redirect("/");
};
