/**
 * context/AuthContext.jsx — Global authentication state.
 *
 * Provides:
 *   user      — current user object (null when logged out)
 *   token     — JWT string (null when logged out)
 *   loading   — true while restoring session from localStorage
 *   login()   — store token + user, persist to localStorage
 *   logout()  — clear token + user from state and localStorage
 *   updateUser() — update user data in context after profile changes
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // Show a loading state while restoring session from localStorage
  const [loading, setLoading] = useState(true);

  // ─── Restore session on first render ─────────────────────────────────────

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      // Validate token by fetching current user from API
      api
        .get('/auth/me', {
          headers: { Authorization: `Bearer ${savedToken}` },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          // Token is invalid or expired — clear storage
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // ─── Login: store token + user ────────────────────────────────────────────

  const login = (tokenValue, userData) => {
    localStorage.setItem('token', tokenValue);
    setToken(tokenValue);
    setUser(userData);
  };

  // ─── Logout: clear token + user ───────────────────────────────────────────

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // ─── Update user in context after profile edits ───────────────────────────

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth — convenience hook to consume AuthContext.
 * Throws if used outside AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
