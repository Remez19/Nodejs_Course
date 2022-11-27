const path = require("path");

/**
 * require.main.filename - gives us the path to the file that
 * responsible for our app runing.
 * in the case of this project -> the path to app.js flie.
 */
module.exports = path.dirname(require.main.filename);
