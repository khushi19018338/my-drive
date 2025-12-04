// routes/index.routes.js
const express = require('express');
const router = express.Router();
const File = require('../models/file.model');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// ------------------------
// PUBLIC LANDING PAGE
// ------------------------
router.get('/', (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.render('index'); // not logged in

  // Verify token to avoid redirect loop
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.redirect('/home'); // valid token → go to home
  } catch (err) {
    res.clearCookie('token');  // invalid token → remove cookie
    return res.render('index');
  }
});

// ------------------------
// USER HOME PAGE (PROTECTED)
// ------------------------
router.get('/home', auth, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.userId });

    res.render('home', {
      user: req.user,
      files
    });

  } catch (err) {
    console.error('Home Page Error:', err);
    res.render('home', {
      user: req.user,
      files: [],
      error: 'Could not load files.'
    });
  }
});

module.exports = router;
