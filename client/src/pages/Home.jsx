/**
 * pages/Home.jsx — Public landing page.
 *
 * Showcases the features of the auth system and provides
 * CTA buttons to Register or Login.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '🔐', title: 'JWT Authentication', desc: '7-day tokens stored securely, auto-attached to every request.' },
  { icon: '🔒', title: 'bcrypt Password Hashing', desc: 'Passwords hashed with 12 salt rounds — never stored in plain text.' },
  { icon: '✅', title: 'Form Validation', desc: 'Client-side feedback + server-side express-validator rules.' },
  { icon: '📊', title: 'Password Strength Meter', desc: 'Real-time visual indicator guides users to strong passwords.' },
  { icon: '👤', title: 'User Profile', desc: 'Edit display name and bio, or change your password anytime.' },
  { icon: '📱', title: 'Responsive Dark UI', desc: 'Looks great on any screen — desktop, tablet, or mobile.' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <main className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">MERN Stack · JWT · bcrypt</div>
        <h1 className="hero-title">
          Secure Auth,<br />
          <span className="gradient-text">Done Right.</span>
        </h1>
        <p className="hero-subtitle">
          A production-ready authentication system built with MongoDB, Express, React, and Node.js.
        </p>
        <div className="hero-cta">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary" id="hero-dashboard-btn">
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" id="hero-register-btn">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-ghost" id="hero-login-btn">
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features grid */}
      <section className="features-section">
        <h2 className="section-title">Everything you need</h2>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API reference strip */}
      <section className="api-strip">
        <h2 className="section-title">API Endpoints</h2>
        <div className="api-table-wrapper">
          <table className="api-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Route</th>
                <th>Auth</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><span className="method post">POST</span></td><td>/api/auth/register</td><td>Public</td><td>Register new user</td></tr>
              <tr><td><span className="method post">POST</span></td><td>/api/auth/login</td><td>Public</td><td>Login, get JWT</td></tr>
              <tr><td><span className="method get">GET</span></td><td>/api/auth/me</td><td>🔐 JWT</td><td>Get current user</td></tr>
              <tr><td><span className="method put">PUT</span></td><td>/api/auth/profile</td><td>🔐 JWT</td><td>Update name/bio</td></tr>
              <tr><td><span className="method put">PUT</span></td><td>/api/auth/change-password</td><td>🔐 JWT</td><td>Change password</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default Home;
