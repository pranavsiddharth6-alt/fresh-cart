import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Package, 
  LogOut, 
  ShieldCheck, 
  Check, 
  Save, 
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, profile, isAdmin, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile || user) {
      setName(profile?.name || user?.user_metadata?.name || '');
      setPhone(profile?.phone || '');
    }
  }, [profile, user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await updateUserProfile({ name, phone });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="profile-page container">
      <div className="profile-layout-grid">
        {/* Left Column: Account Card */}
        <div className="profile-sidebar-card">
          <div className="profile-avatar-large">
            {(name || user?.email || 'U')[0].toUpperCase()}
          </div>
          <h2 className="profile-user-name">{name || 'Supermarket Shopper'}</h2>
          <p className="profile-user-email">{user?.email || 'customer@example.com'}</p>
          
          <div className="profile-role-badge">
            {isAdmin ? (
              <span className="role-pill role-admin">
                <ShieldCheck size={14} /> Store Administrator
              </span>
            ) : (
              <span className="role-pill role-customer">
                🛒 Verified Customer
              </span>
            )}
          </div>

          <div className="profile-quick-actions">
            <Link to="/orders" className="profile-action-link">
              <Package size={18} />
              <span>My Orders</span>
            </Link>

            {isAdmin && (
              <Link to="/admin" className="profile-action-link admin-action-link">
                <ShieldCheck size={18} />
                <span>Admin Dashboard</span>
              </Link>
            )}

            <button onClick={handleLogout} className="profile-action-link logout-btn">
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Right Column: Edit Profile Details */}
        <div className="profile-main-card">
          <div className="profile-card-header">
            <div>
              <h1 className="page-heading">Personal Information</h1>
              <p className="page-subheading">Update your contact details for grocery deliveries.</p>
            </div>
          </div>

          {saveSuccess && (
            <div className="success-alert-banner">
              <Check size={18} />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          {error && (
            <div className="error-alert-banner">
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="profile-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  id="fullName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="emailAddress">Email Address (Registered)</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="emailAddress"
                  value={user?.email || ''}
                  disabled
                  className="disabled-input"
                />
              </div>
              <span className="form-input-hint">Email is linked to your Supabase authentication account.</span>
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Contact Phone Number</label>
              <div className="input-with-icon">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 321-7890"
                />
              </div>
              <span className="form-input-hint">Used by our delivery team to contact you when arriving.</span>
            </div>

            <div className="profile-form-footer">
              <button 
                type="submit" 
                disabled={saving}
                className="btn-primary btn-large"
              >
                <Save size={18} />
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
