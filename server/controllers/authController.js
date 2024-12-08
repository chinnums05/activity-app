const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const AppError = require('../utils/AppError');

// Async handler wrapper
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400);
  }

  const { username, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    throw new AppError('User already exists', 400);
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
  });

  res.status(201).json({
    status: 'success',
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400);
  }

  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  res.json({
    status: 'success',
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    }
  });
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({
    status: 'success',
    data: req.user
  });
});

module.exports = {
  register,
  login,
  getMe,
};