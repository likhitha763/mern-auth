/**
 * components/PrivateRoute.jsx — Route guard for protected pages.
 *
 * Redirects unauthenticated users to /login.
 * While the auth session is loading (restoring from localStorage),
 * renders a full-screen spinner so there's no flash of redirect.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show a spinner while the session is being restored
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" aria-label="Loading…" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
