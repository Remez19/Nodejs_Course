const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Remez</h1>");
});

module.exports = router;
