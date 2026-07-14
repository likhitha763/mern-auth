/**
 * controllers/authController.js — Handlers for all authentication routes.
 *
 * Exports:
 *   register        POST /api/auth/register   — Create new user account
 *   login           POST /api/auth/login      — Authenticate and return JWT
 *   getMe           GET  /api/auth/me         — Return current user (protected)
 *   updateProfile   PUT  /api/auth/profile    — Update name / bio (protected)
 *   changePassword  PUT  /api/auth/change-password — Change password (protected)
 */

const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// ─── Helper: sign a JWT for a given user id ────────────────────────────────────

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// ─── Helper: send validation errors from express-validator ────────────────────

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  // Return early if validation failed
  if (handleValidationErrors(req, res)) return;

  const { name, email, password } = req.body;

  try {
    // Check if email is already in use
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    // Create user — password will be hashed by pre-save hook
    const user = await User.create({ name, email, password });

    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Login with email + password
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { email, password } = req.body;

  try {
    // Find user including password (field is select: false by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare submitted password with stored hash
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private (JWT required)
// ─────────────────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  // req.user is attached by the protect middleware
  const user = req.user;
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    createdAt: user.createdAt,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update user profile (name and/or bio)
// @route   PUT /api/auth/profile
// @access  Private (JWT required)
// ─────────────────────────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { name, bio } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private (JWT required)
// ─────────────────────────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { currentPassword, newPassword } = req.body;

  try {
    // Fetch user including password for comparison
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify the current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Assign new password — pre-save hook will hash it
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err.message);
    res.status(500).json({ message: 'Server error changing password' });
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword };
