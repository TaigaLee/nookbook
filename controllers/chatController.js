const express = require("express")
const router = express.Router()
const User = require("../models/user")
const http = require("http").createServer(router)
const io = require("socket.io")(http)


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
		// io.on("connection", (socket) => {
		// 	socket.join(req.params.id.toString())
  // 			socket.on("room message", (msg) => {
  //   		io.to(req.params.id.toString()).emit("room message", msg)
  // 			})
		// })
		const roomOwner = await User.findById(req.params.id)
		res.render("chat/myRoom.ejs", {roomOwner: roomOwner})
	} catch (err) {
		next(err)
	}
})

module.exports = router