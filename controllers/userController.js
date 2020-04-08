const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/', async (req, res, next) => {
  if (req.session.loggedIn) {
    const currentUser = await User.findById(req.session.userId).populate('island');
    req.session.notcurrentUser = false;
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

// show other account profile
router.get('/:username', async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const notcurrentUser = req.session.username !== req.params.username ? true : false;
        res.render('user/index.ejs', {
            user: user,
            notcurrentUser: notcurrentUser
        })
    } catch (err) {
        next(err);
    }
})


module.exports = router