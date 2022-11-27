const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

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
app.use("/admin", adminRoutes);

app.use(shopRoutes);

/**
 * Handle the errors at the end.
 * Because of the niddleware logic.
 * If there is not path that is valid than
 * the last option will be error.
 * "Catch all" Route.
 */
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

/*
const server = http.createServer(app);

server.listen(3000);
*/
// Alternitavly

app.listen(3000);
