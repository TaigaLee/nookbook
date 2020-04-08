const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/', async (req, res, next) => {
  if (req.session.loggedIn) {
    const currentUser = await User.findById(req.session.userId).populate('island');
    res.render('user/index.ejs', {
        user: currentUser
    })
  } else {
    res.redirect('/auth/login');
  }
})

// add profile picture router 
router.get('/add-profile', (req, res) => {
  if (req.session.loggedIn) {
    res.render('user/add-profile.ejs')
  } else {
    res.redirect('/auth/login')
  }
})

router.post('/add-profile', (req, res) => {
  res.send('after add profile picture action')
})


module.exports = router