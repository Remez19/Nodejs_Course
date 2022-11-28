const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

/**
 * Letting express now that we using
 * a templating engine (such as pug).
 * We set a global coinfiguration value.
 */

app.set("view engine", "pug");
/**
 * Telling express where he can find the templates.
 */
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

/**
 * If we have diffrent routes with the same segment - all starts with
 * "/admin" than we can filter for those as such.
 * Now only routes that start with "/admin"
 * will go to the admin flie routes also, express will
 * ignore the "/admin" part in the url when it try to
 * match a path.
 */
app.use("/admin", adminData.routes);

app.use(shopRoutes);

/**
 * Handle the errors at the end.
 * Because of the niddleware logic.
 * If there is not path that is valid than
 * the last option will be error.
 * "Catch all" Route.
 */
app.use((req, res) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
  });
  // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

/*
const server = http.createServer(app);

server.listen(3000);
*/
// Alternitavly

app.listen(3000, () => {
  console.log("Server Start on port 3000");
});
