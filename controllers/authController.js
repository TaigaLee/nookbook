const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("auth/register.ejs");
});

router.post("/register", async (req, res, next) => {
  try {
  	if (req.body.password == req.body.verifyPassword) {
  		const desiredUsername = req.body.username;
  		const checkUsername = await User.findOne({username: desiredUsername})
  		if (checkUsername) {
  			req.session.message = "Username already taken"
  			res.redirect("/auth/register")
  		} else {
			const salt = bcrypt.genSaltSync(10)
			req.body.password = bcrypt.hashSync(req.body.password, salt)
			const createdUser = await User.create(req.body)
			console.log(createdUser)
			res.redirect("/")
  		}
  	} else {
  		req.session.message = "Passwords must match"
  		res.redirect("/auth/register")
  		console.log("passwords don't match")
  	}

  } catch (err) {
    next(err);
  }
});

module.exports = router;
