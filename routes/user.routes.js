const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ----------------------------------------------
// GET REGISTER PAGE
// ----------------------------------------------
router.get('/register', (req, res) => {
  res.render('register', { errors: [], message: null });
});

// ----------------------------------------------
// POST REGISTER USER
// ----------------------------------------------
router.post(
  '/register',
  [
    body('email').trim().isEmail().withMessage('Enter a valid email'),
    body('password').trim().isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render('register', {
        errors: errors.array(),
        message: null,
      });
    }

    try {
      const { username, email, password } = req.body;

      // Check if email or username exists
      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
      });

      if (existingUser) {
        return res.render('register', {
          errors: [],
          message: '❗ Email or username already exists',
        });
      }

      // Create new user (password will auto-hash in model)
      await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password,
      });

      return res.render('login', {
        message: '✅ Registration successful! Please log in.',
        errors: [],
      });

    } catch (err) {
      console.error('Registration Error:', err);
      res.status(500).render('register', {
        errors: [],
        message: '❗ Server error during registration',
      });
    }
  }
);

// ----------------------------------------------
// GET LOGIN PAGE
// ----------------------------------------------
router.get('/login', (req, res) => {
  res.render('login', { errors: [], message: null });
});

// ----------------------------------------------
// POST LOGIN USER
// ----------------------------------------------
router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').trim().notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('login', {
        errors: errors.array(),
        message: null,
      });
    }

    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username: username.toLowerCase() });
      if (!user) {
        return res.render('login', {
          errors: [],
          message: 'Invalid username or password',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.render('login', {
          errors: [],
          message: 'Invalid username or password',
        });
      }

      // Make JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true only if using HTTPS
        sameSite: 'lax',
      });

      return res.redirect('/home');

    } catch (err) {
      console.error('Login Error:', err);
      res.status(500).render('login', {
        errors: [],
        message: 'Server error during login',
      });
    }
  }
);

// ----------------------------------------------
// LOGOUT USER
// ----------------------------------------------
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/user/login');
});

module.exports = router;
