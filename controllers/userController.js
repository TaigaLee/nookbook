const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('user/index.ejs')
})

router.get('/add-profile', (req, res) => {
    res.render('user/add-profile.ejs')
})

module.exports = router