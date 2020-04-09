const express = require("express");
const router = express.Router();
const User = require("../models/user");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = router;
