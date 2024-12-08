const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register,
  login,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post(
  '/register',
  [
    body('username').notEmpty().trim(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').exists()
  ],
  login
);

router.get('/me', protect, getMe);

module.exports = router;