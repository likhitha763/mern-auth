/**
 * routes/auth.js — Authentication routes with express-validator validation rules.
 *
 * Routes:
 *   POST /api/auth/register         — Register a new user
 *   POST /api/auth/login            — Login and receive JWT
 *   GET  /api/auth/me               — Get current user (protected)
 *   PUT  /api/auth/profile          — Update name / bio (protected)
 *   PUT  /api/auth/change-password  — Change password (protected)
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// ─── Validation rule sets ─────────────────────────────────────────────────────

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 60 }).withMessage('Name cannot exceed 60 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

const profileValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ max: 60 }).withMessage('Name cannot exceed 60 characters'),

  body('bio')
    .optional()
    .isLength({ max: 300 }).withMessage('Bio cannot exceed 300 characters'),
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from the current password');
      }
      return true;
    }),
];

// ─── Route definitions ────────────────────────────────────────────────────────

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes (JWT required)
router.get('/me', protect, getMe);
router.put('/profile', protect, profileValidation, updateProfile);
router.put('/change-password', protect, changePasswordValidation, changePassword);

module.exports = router;
