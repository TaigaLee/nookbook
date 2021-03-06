const express = require("express");
const router = express.Router();
const User = require("../models/user");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const RatingPicture = require("../models/ratingPicture");
const Comment = require("../models/comment")

// update status
router.get("/status", async (req, res, next) => {
  try {
    if (req.session.loggedIn) {
      const currentUser = await User.findById(req.session.userId);
      res.render("user/status.ejs", { currentStatus: currentUser.status });
    } else {
      req.session.message = "You must be logged in to do that";
      res.redirect("/auth/login");
    }
  } catch (err) {
    next(err);
  }
});

router.put("/status", async (req, res, next) => {
  try {
    if (req.session.loggedIn) {
      await User.findByIdAndUpdate(req.session.userId, {
        status: req.body.status
      });
      res.redirect("/user");
    } else {
      req.session.message = "You must be logged in to do that";
      res.redirect("/auth/login");
    }
  } catch (err) {
    next(err);
  }
});

// search for users
router.get("/search", async (req, res, next) => {
  try {
    let foundUsers = [];
    if (req.query.searchInfo) {
      const re = new RegExp(req.query.searchInfo, "i");
      foundUsers = await User.find({ username: re });
    }
    res.render("user/search.ejs", { searchResults: foundUsers });
  } catch (err) {
    next(err);
  }
});

// show current user profile
router.get("/", async (req, res, next) => {
  try {
    if (req.session.loggedIn) {
      const currentUser = await User.findById(req.session.userId).populate(
        "island"
      );
      req.session.notcurrentUser = false;
      const arrayOfFriends = [];
      for (let i = 0; i < currentUser.friends.length; i++) {
        const friendToAppend = await User.findById(currentUser.friends[i]);
        arrayOfFriends.push(friendToAppend);
      }
      const posts = await RatingPicture.find({ userId: currentUser._id });
      res.render("user/show.ejs", {
        user: currentUser,
        friends: arrayOfFriends,
        posts: posts
      });
    } else {
      res.redirect("/auth/login");
    }
  } catch (err) {
    next(err);
  }
}); // show current user profile

router.get("/friends-posts", async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.session.userId);
    const friends = currentUser.friends;
    const friendsPosts = [];
    for (let i = 0; i < friends.length; i++) {
      const friendPictures = await RatingPicture.find({
        user: friends[i]
      }).populate("user");
      for (let i = 0; i < friendPictures.length; i++) {
        friendsPosts.push(friendPictures[i]);
      }
    }
    res.render("user/friends-posts.ejs", {
      posts: friendsPosts
    });
  } catch (err) {
    next(err);
  }
});

// add profile picture -- this is for test, can be modified and adjusted
router.get("/add-pic", (req, res) => {
  if (req.session.loggedIn) {
    res.render("user/add-pic.ejs");
  } else {
    res.redirect("/auth/login");
  }
}); // add profile picture router

router.post("/add-pic", upload.single("pic"), async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    user.profilePicture.data = req.file.buffer;
    user.profilePicture.contentType = req.file.mimetype;
    user.hasPicture = true;
    user.save();
    res.redirect("/user/edit");
  } catch (err) {
    next(err);
  }
});

router.get("/:id/pic", async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.params.id).populate("island");
    if (foundUser.hasPicture) {
      res.set("Content-Type", foundUser.profilePicture.contentType);
      res.send(foundUser.profilePicture.data);
    } else {
      res.redirect("/assets/photos/profile-default.png");
    }
  } catch (err) {
    next(err);
  }
});

// edit route
// show edit ejs
router.get("/edit", async (req, res, next) => {
  try {
    if (req.session.loggedIn) {
      const userToEdit = await User.findById(req.session.userId);
      res.render("user/edit.ejs", {
        userToEdit: userToEdit
      });
    } else {
      res.redirect("/auth/login");
    }
  } catch (err) {
    next(err);
  }
}); // show edit ejs

// put method
router.put("/edit", async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.session.userId, req.body);
    res.redirect("/user");
  } catch (err) {
    next(err);
  }
});

// delete route
router.delete("/", async (req, res, next) => {
  try {
    const friendsToDelete = await User.find({friends: req.session.userId})
    for (let i = 0; i < friendsToDelete.length; i++) {
      const indexToSplice = friendsToDelete[i].friends.indexOf(req.session.userId)
      friendsToDelete[i].friends.splice(indexToSplice, 1)
      await friendsToDelete[i].save()
    }
    const commentsToDelete = Comment.find({user: req.session.userId})
    for (let i = 0; i < commentsToDelete.length; i++) {
      await Comment.findByIdAndDelete(commentsToDelete[i]._id)
    }
    const postsToDelete = await RatingPicture.find({user: req.session.userId})
    for (let i = 0; i < postsToDelete.length; i++) {
      const deleted = await RatingPicture.findByIdAndDelete(postsToDelete[i]._id)
    }
    const deletedUser = await User.deleteOne({
      username: req.session.username
    });
    await req.session.destroy();
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

// show a list of current users
router.get("/list", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.render("user/index.ejs", {
      users: users
    });
  } catch (err) {
    next(err);
  }
});
// show other account profile
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("island");
    if (user) {
      // check if the viewing user is the current user
      const notcurrentUser =
        req.session.username !== user.username ? true : false;

      // check if the viewing user is friend of the current user
      let isFriend = false;
      if (req.session.loggedIn) {
        const currentUser = await User.findById(req.session.userId);
        const friendList = currentUser.friends;
        isFriend = friendList.indexOf(req.params.id) !== -1 ? true : false;
      }
      const arrayOfFriends = [];
      for (let i = 0; i < user.friends.length; i++) {
        const friendToAppend = await User.findById(user.friends[i]);
        arrayOfFriends.push(friendToAppend);
      }
      const posts = await RatingPicture.find({ user: user._id });
      res.render("user/show.ejs", {
        user: user,
        notcurrentUser: notcurrentUser,
        isFriend: isFriend,
        friends: arrayOfFriends,
        posts: posts
      });
    } else {
      req.session.message = "The user does not exist";
      res.redirect("/*");
    }
  } catch (err) {
    next(err);
  }
}); // show other account profile

// add friend route
router.put("/:id/add-friend", async (req, res, next) => {
  try {
    const currentUser = await User.findOne({ username: req.session.username });
    currentUser.friends.push(req.params.id);
    await currentUser.save();
    res.redirect("/user/" + req.params.id);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
