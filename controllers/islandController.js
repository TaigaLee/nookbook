const express = require("express")
const router = express.Router()
const User = require("../models/user")
const Island = require("../models/island")

router.get("/new", async (req, res, next) => {
	const fruits = ["peach", "cherry", "orange", "apple", "pear"]
	res.render("island/new.ejs", {fruits: fruits})
})

// create island route
router.post('/new', async (req, res, next) => {
    try {
        // check if you already have an island in the current login accout 
        const newIsland = await Island.create(req.body)
        const currentUser = await User.findById(req.session.userId)
        currentUser.island = newIsland
        await currentUser.save()
        res.redirect('/')
    } catch (err) {
        next(err)
    }
})

router.get("/:id/update", async (req, res, next) => {
    try {
        const islandToEdit = await Island.findById(req.params.id)
        res.render("island/update.ejs", {island: islandToEdit})
    } catch (err) {
        next(err)
    }
})

router.put("/:id", async (req, res, next) => {
    try {
        const updatedIsland = await Island.findByIdAndUpdate(req.params.id, req.body)
        res.redirect("/user")
    } catch (err) {
        next(err)
    }
})



module.exports = router