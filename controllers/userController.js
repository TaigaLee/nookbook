const express = require('express')
const router = express.Router()
const User = require('../models/user')

// show current user profile
router.get('/', async (req, res, next) => {
  try {
    if (req.session.loggedIn) {
      const currentUser = await User.findById(req.session.userId).populate('island');
      req.session.notcurrentUser = false;
      res.render('user/index.ejs', {
        user: currentUser
      })
    } else {
      res.redirect('/auth/login');
    }
  } catch (err) {
    next(err)
  }
}) // show current user profile

// add profile picture -- this is for test, can be modified and adjusted
router.get('/add-profile', (req, res) => {
  if (req.session.loggedIn) {
    res.render('user/add-profile.ejs')
  } else {
    res.redirect('/auth/login')
  }
}) // add profile picture router 

router.post('/add-profile', (req, res) => {
  res.send('after add profile picture action')
})

// edit route
// show edit ejs
router.get('/edit', async (req, res, next) => {
  try {
    if (req.session.loggedIn) {
      const userToEdit = await User.findOne({ username: req.session.username })
      res.render('user/edit.ejs', {
        userToEdit: userToEdit
      })
    } else {
      res.redirect('/auth/login')
    }
  } catch (err) {
    next(err)
  }
}) // show edit ejs

// put method
router.put('/edit') // edit route

// delete route
router.delete('/', async (req, res, next) => {
  try {
    const deletedUser = await User.deleteOne({ username: req.session.username })
    await req.session.destroy()
    res.redirect('/')
  } catch (err) {
    next(err);
  }
})

// show other account profile
router.get('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      const notcurrentUser = req.session.username !== req.params.username ? true : false;
      res.render('user/index.ejs', {
        user: user,
        notcurrentUser: notcurrentUser
      })
    } else {
      req.session.message = "The user does not exist"
      res.redirect('/*');
    }
  } catch (err) {
    next(err);
  }
}) // show other account profile


module.exports = router