const express = require("express")
const router = express.Router()
const User = require("../models/user")

router.get("/", (req, res) => {
	if (req.session.loggedIn) {
		res.render("chat/index.ejs")
	} else {
		req.session.message = "Log in to use chat"
		res.redirect("/auth/login")
	}
})

router.get("/global", (req, res) => {
	if (req.session.loggedIn) {
		res.render("chat/global.ejs")
	} else {
		req.session.message = "Log in to use chat"
		res.redirect("/auth/login")
	}
})

router.get("/:id", async (req, res, next) => {
	try {
		const roomOwner = await User.findById(req.params.id)
		res.render("chat/myRoom.ejs", {roomOwner: roomOwner})
	} catch (err) {
		next(err)
	}
})

module.exports = router