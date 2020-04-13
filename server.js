require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const session = require("express-session");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const PORT = process.env.PORT;
const io = require("socket.io")(http);

require("./db/db.js");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  req.session.message = "";
  res.locals.username = req.session.username;
  res.locals.loggedIn = req.session.loggedIn;
  res.locals.notcurrentUser = req.session.notcurrentUser;
  res.locals.userId = req.session.userId;
  next();
});

io.on("connection", socket => {
  socket.on("chat global", msg => {
    io.emit("chat global", msg);
  });
  socket.on("join", chatOwner => {
    socket.join(chatOwner);
  });
  socket.on("chat message", (msg, chatOwner) => {
    io.to(chatOwner).emit("chat message", msg);
  });
});

// controllers

const authController = require("./controllers/authController.js");
app.use("/auth", authController);

const islandController = require("./controllers/islandController");
app.use("/island", islandController);

const userController = require("./controllers/userController");
app.use("/user", userController);

const marketController = require("./controllers/marketController");
app.use("/market", marketController);

const ratingPictureController = require("./controllers/ratingPictureController");
app.use("/rating-pictures", ratingPictureController);

const chatController = require("./controllers/chatController");
app.use("/chat", chatController);

app.get("/", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/user/friends-posts");
  } else {
    res.render("home.ejs");
  }
});

app.get("*", (req, res) => {
  res.render("404.ejs");
});

http.listen(PORT, () => {
  const d = new Date();
  console.log(`${d.toLocaleString()}: Server listening on port ${PORT}`);
});
