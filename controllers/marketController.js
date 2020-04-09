const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Item = require("../models/item");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res, next) => {
  try {
    const foundItems = await Item.find().populate("user");
    res.render("market/index.ejs", {
      items: foundItems,
      userId: req.session.userId
    });
  } catch (err) {
    next(err);
  }
});

router.get("/new", (req, res) => {
  res.render("market/new.ejs");
});

router.get("/:id", async (req, res, next) => {
  try {
    const foundItem = await Item.findById(req.params.id).populate("user");

    res.render("market/show.ejs", {
      item: foundItem
    });
  } catch (err) {
    next(err);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    const itemToCreate = {
      name: req.body.name,
      price: req.body.price,
      user: req.session.userId
    };

    if (req.body.hot === "on") {
      itemToCreate.hot = true;
    } else {
      itemToCreate.hot = false;
    }
    const createdItem = await Item.create(itemToCreate);
    res.redirect("/market/" + createdItem.id);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const itemToDelete = await Item.findByIdAndDelete(req.params.id);
    res.redirect("/market");
    console.log(itemToDelete);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/edit", async (req, res, next) => {
  try {
    const foundItem = await Item.findById(req.params.id);
    res.render("market/edit.ejs", {
      item: foundItem
    });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updatedItem = {
      name: req.body.name,
      price: req.body.price
    };

    if (req.body.hot == "on") {
      updatedItem.hot = true;
    } else {
      updatedItem.hot = false;
    }

    await Item.findByIdAndUpdate(req.params.id, updatedItem);

    res.redirect("/market");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
