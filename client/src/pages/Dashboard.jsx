/**
 * pages/Dashboard.jsx — Protected user dashboard.
 *
 * Displays:
 *   - Welcome message with user name
 *   - User info cards (email, member since, bio)
 *   - Quick links to Profile and logout
 *
 * Access: JWT required (enforced by PrivateRoute)
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  return (
    <main className="dashboard-page">
      {/* Header */}
      <section className="dash-header">
        <div className="dash-avatar" aria-hidden="true">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="dash-welcome">Welcome back, {user?.name}! 👋</h1>
          <p className="dash-sub">Here's an overview of your account.</p>
        </div>
      </section>

      {/* Info cards */}
      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-icon">📧</div>
          <div>
            <p className="dash-card-label">Email Address</p>
            <p className="dash-card-value">{user?.email}</p>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-icon">📅</div>
          <div>
            <p className="dash-card-label">Member Since</p>
            <p className="dash-card-value">{memberSince}</p>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-icon">💬</div>
          <div>
            <p className="dash-card-label">Bio</p>
            <p className="dash-card-value">
              {user?.bio || <span className="muted">No bio yet — add one in Profile.</span>}
            </p>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-icon">🔒</div>
          <div>
            <p className="dash-card-label">Security</p>
            <p className="dash-card-value">Password protected · JWT session active</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <section className="dash-actions">
        <Link to="/profile" className="btn btn-primary" id="dash-edit-profile-btn">
          ✏️ Edit Profile
        </Link>
        <button className="btn btn-ghost" id="dash-logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </section>
    </main>
  );
};

export default Dashboard;
