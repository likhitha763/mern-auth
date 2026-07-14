/**
 * models/User.js — Mongoose User schema with bcrypt password hashing.
 *
 * Fields:
 *   name     — display name
 *   email    — unique login credential
 *   password — hashed via bcrypt (salt rounds: 12)
 *   bio      — short user bio (optional)
 *   createdAt — auto-managed by timestamps option
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      // Never return plain or hashed password in API responses by default
      select: false,
    },
    bio: {
      type: String,
      default: '',
      maxlength: [300, 'Bio cannot exceed 300 characters'],
    },
  },
  { timestamps: true }
);

// ─── Pre-save Hook: hash password before storing ──────────────────────────────

UserSchema.pre('save', async function () {
  // Only hash the password when it has been modified (or is new)
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Instance Method: compare plain password with stored hash ─────────────────

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
