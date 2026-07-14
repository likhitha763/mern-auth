/**
 * server.js — Entry point for the MERN Auth System backend.
 * Connects to MongoDB and starts the Express server.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

// Parse incoming JSON request bodies
app.use(express.json());

// Enable CORS for the React frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// ─── Routes ──────────────────────────────────────────────────────────────────

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Root health-check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'MERN Auth API is running ✅' });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// ─── Database + Server Start ──────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth_system';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
