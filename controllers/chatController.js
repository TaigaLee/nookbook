const express = require("express")
const router = express.Router()

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

module.exports = router