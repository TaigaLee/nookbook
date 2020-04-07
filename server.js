require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const session = require("express-session");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const PORT = process.env.PORT;

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

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("*", (req, res) => {
  res.render("404.ejs");
});

http.listen(PORT, () => {
  const d = new Date();
  console.log(`${d.toLocaleString()}: Server listening on port ${PORT}`);
});
