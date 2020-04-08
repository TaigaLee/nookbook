const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("auth/register.ejs");
});

router.post("/register", async (req, res, next) => {
  try {
    const desiredUsername = req.body.username;
    const desiredPassword = req.body.password;
    const islandName = req.body.island;
  } catch (err) {
    next(err);
  }
});

module.exports = router;
