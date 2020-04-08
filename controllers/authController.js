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
			req.session.loggedIn = true
			req.session.userId = createdUser._id
			req.session.username = createdUser.username
			req.session.message = `Welcome new user: ${createdUser.username}!`
			res.redirect("/island/new")
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

router.get("/login", (req, res) => {
	res.render("auth/login.ejs")
})

router.post("/login", async (req, res, next) => {
	try {
		const user = await User.findOne({username: req.body.username})
		if (user) {
			const validLogin = bcrypt.compareSync(req.body.password, user.password)
			if (validLogin) {
				req.session.loggedIn = true
				req.session.userId = user._id
				req.session.username = user.username
				req.session.message = `Welcome back, ${user.username}!`
				res.redirect("/")
			} else {
				req.session.message = "Invalid username or password"
				res.redirect("/auth/login")
			}
		} else {
			req.session.message = "Invalid username or password"
			res.redirect("/auth/login")
		}
	} catch (err) {
		next(err)
	}
})

router.get("/logout", async (req, res) => {
	await req.session.destroy()
	res.redirect("/")
})

module.exports = router;
