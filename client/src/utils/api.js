/**
 * utils/api.js — Axios instance with JWT request interceptor.
 *
 * All API calls made through this instance will automatically:
 *   - Use the correct backend base URL (from VITE_API_URL)
 *   - Attach the stored JWT as a Bearer token in the Authorization header
 */

import axios from 'axios';

// Base URL defaults to the Vite environment variable, or falls back to localhost
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor: attach JWT if available ────────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: surface error messages cleanly ───────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalise the error message for easy consumption in components
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
