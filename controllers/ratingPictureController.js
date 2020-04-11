const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// models
const User = require("../models/user");
const RatingPicture = require("../models/ratingPicture");

// show index route
router.get("/", async (req, res, next) => {
  try {
    const pictures = await RatingPicture.find({});
    res.render("ratingPicture/index.ejs", {
      pictures: pictures
    });
  } catch (err) {
    next(err);
  }
});

// create pictures for ratings
// show new ejs
router.get("/new", async (req, res, next) => {
  try {
    if (req.session.loggedIn) {
      res.render("ratingPicture/new.ejs");
    } else {
      res.redirect("/auth/login");
    }
  } catch (err) {
    next(err);
  }
}); // show new ejs

// post route
router.post("/new", upload.single("image"), async (req, res, next) => {
  try {
    const ratingPicture = await RatingPicture.create({
      name: req.body.name,
      user: req.session.userId,
      category: req.body.category,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });
    res.redirect("/rating-pictures");
  } catch (err) {
    next(err);
  }
});

// render picture @ /rating-pictures/:id/img
router.get("/:id/img", async (req, res, next) => {
  try {
    const ratingPicture = await RatingPicture.findById(req.params.id);
    res.set("Content-Type", ratingPicture.image.contentType);
    res.send(ratingPicture.image.data);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const ratingPicture = await RatingPicture.findById(req.params.id);
    ratingPicture.likes.push(req.session.userId);
    await ratingPicture.save();
    res.redirect("/rating-pictures");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
