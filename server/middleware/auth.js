/**
 * middleware/auth.js — JWT protect middleware.
 *
 * Attaches the decoded user payload to req.user for downstream
 * controllers when a valid Bearer token is present in the Authorization header.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — Verifies the JWT from the Authorization header.
 * Usage: router.get('/protected', protect, controller)
 */
const protect = async (req, res, next) => {
  let token;

  // Extract token from "Authorization: Bearer <token>" header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorised — no token provided' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user (excluding password) to the request object
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorised — user not found' });
    }

    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ message: 'Not authorised — invalid token' });
  }
};

module.exports = { protect };
