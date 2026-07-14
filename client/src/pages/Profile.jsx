/**
 * pages/Profile.jsx — Protected profile editing page.
 *
 * Two sections:
 *   1. Edit Profile — update name and bio
 *   2. Change Password — verify current password, set new password with strength meter
 *
 * Access: JWT required (enforced by PrivateRoute)
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

// ─── Password strength helper ─────────────────────────────────────────────────

const getStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'var(--strength-weak)' };
  if (score === 2) return { score: 2, label: 'Fair', color: 'var(--strength-fair)' };
  if (score === 3) return { score: 3, label: 'Good', color: 'var(--strength-good)' };
  return { score: 4, label: 'Strong', color: 'var(--strength-strong)' };
};

const Profile = () => {
  const { user, updateUser } = useAuth();

  // ─── Profile form state ──────────────────────────────────────────────────

  const [profile, setProfile] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
  });
  const [profileStatus, setProfileStatus] = useState({ type: '', msg: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // ─── Password form state ─────────────────────────────────────────────────

  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [pwStatus, setPwStatus] = useState({ type: '', msg: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const newStrength = getStrength(pwForm.newPassword);

  // ─── Profile handlers ─────────────────────────────────────────────────────

  const handleProfileChange = (e) => {
    setProfileStatus({ type: '', msg: '' });
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileStatus({ type: '', msg: '' });

    if (!profile.name.trim()) {
      return setProfileStatus({ type: 'error', msg: 'Name cannot be empty.' });
    }

    setProfileLoading(true);
    try {
      const { data } = await api.put('/auth/profile', {
        name: profile.name.trim(),
        bio: profile.bio,
      });
      updateUser(data);
      setProfileStatus({ type: 'success', msg: 'Profile updated successfully!' });
    } catch (err) {
      setProfileStatus({ type: 'error', msg: err.message });
    } finally {
      setProfileLoading(false);
    }
  };

  // ─── Password handlers ────────────────────────────────────────────────────

  const handlePwChange = (e) => {
    setPwStatus({ type: '', msg: '' });
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwStatus({ type: '', msg: '' });

    if (!pwForm.currentPassword) return setPwStatus({ type: 'error', msg: 'Current password is required.' });
    if (pwForm.newPassword.length < 6) return setPwStatus({ type: 'error', msg: 'New password must be at least 6 characters.' });
    if (pwForm.newPassword !== pwForm.confirmNewPassword) return setPwStatus({ type: 'error', msg: 'New passwords do not match.' });

    setPwLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwStatus({ type: 'success', msg: 'Password changed successfully!' });
      setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPwStatus({ type: 'error', msg: err.message });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <main className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <div>
          <h1 className="profile-name">{user?.name}</h1>
          <p className="profile-email">{user?.email}</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* ── Edit Profile Card ── */}
        <section className="profile-card" aria-labelledby="edit-profile-heading">
          <h2 id="edit-profile-heading" className="card-title">✏️ Edit Profile</h2>

          {profileStatus.msg && (
            <div className={`alert alert-${profileStatus.type}`} role="alert" id="profile-status">
              {profileStatus.type === 'success' ? '✅' : '⚠️'} {profileStatus.msg}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} noValidate id="profile-form">
            <div className="form-group">
              <label htmlFor="profile-name">Display Name</label>
              <input
                id="profile-name"
                type="text"
                name="name"
                className="form-input"
                value={profile.name}
                onChange={handleProfileChange}
                maxLength={60}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile-bio">Bio <span className="optional">(optional)</span></label>
              <textarea
                id="profile-bio"
                name="bio"
                className="form-input form-textarea"
                placeholder="Tell us a little about yourself…"
                value={profile.bio}
                onChange={handleProfileChange}
                maxLength={300}
                rows={4}
              />
              <span className="char-count">{profile.bio.length}/300</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              id="profile-save-btn"
              disabled={profileLoading}
            >
              {profileLoading ? <span className="spinner-sm" /> : 'Save Changes'}
            </button>
          </form>
        </section>

        {/* ── Change Password Card ── */}
        <section className="profile-card" aria-labelledby="change-pw-heading">
          <h2 id="change-pw-heading" className="card-title">🔒 Change Password</h2>

          {pwStatus.msg && (
            <div className={`alert alert-${pwStatus.type}`} role="alert" id="pw-status">
              {pwStatus.type === 'success' ? '✅' : '⚠️'} {pwStatus.msg}
            </div>
          )}

          <form onSubmit={handlePwSubmit} noValidate id="change-password-form">
            <div className="form-group">
              <label htmlFor="current-password">Current Password</label>
              <input
                id="current-password"
                type="password"
                name="currentPassword"
                className="form-input"
                placeholder="Enter current password"
                value={pwForm.currentPassword}
                onChange={handlePwChange}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                name="newPassword"
                className="form-input"
                placeholder="At least 6 characters"
                value={pwForm.newPassword}
                onChange={handlePwChange}
                autoComplete="new-password"
                required
              />
              {pwForm.newPassword && (
                <div className="strength-meter" aria-label={`Password strength: ${newStrength.label}`}>
                  <div className="strength-bar-track">
                    <div
                      className="strength-bar-fill"
                      style={{
                        width: `${(newStrength.score / 4) * 100}%`,
                        backgroundColor: newStrength.color,
                      }}
                    />
                  </div>
                  <span className="strength-label" style={{ color: newStrength.color }}>
                    {newStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirm-new-password">Confirm New Password</label>
              <input
                id="confirm-new-password"
                type="password"
                name="confirmNewPassword"
                className="form-input"
                placeholder="Re-enter new password"
                value={pwForm.confirmNewPassword}
                onChange={handlePwChange}
                autoComplete="new-password"
                required
              />
              {pwForm.confirmNewPassword && pwForm.newPassword !== pwForm.confirmNewPassword && (
                <p className="field-error">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              id="change-pw-submit-btn"
              disabled={pwLoading}
            >
              {pwLoading ? <span className="spinner-sm" /> : 'Change Password'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Profile;
