const bodyParser = require("body-parser");
const express = require("express");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(adminRoutes);

app.use(shopRoutes);

/**
 * Handle the errors at the end.
 * Because of the niddleware logic.
 * If there is not path that is valid than
 * the last option will be error.
 */
app.use((req, res) => {
  res.status(404).send("<h1>Page not found</h1>");
});
/*
const server = http.createServer(app);

server.listen(3000);
*/
// Alternitavly

app.listen(3000);
