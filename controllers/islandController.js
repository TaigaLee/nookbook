const express = require("express")
const router = express.Router()
const User = require("../models/user")
const Island = require("../models/island")

router.get("/new", async (req, res, next) => {
	const fruits = ["peach", "cherry", "orange", "apple", "pear"]
	res.render("island/new.ejs", {fruits: fruits})
})





module.exports = router