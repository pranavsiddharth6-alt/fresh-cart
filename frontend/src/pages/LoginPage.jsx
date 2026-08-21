import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await login(email, password);
      if (res?.success) {
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await loginWithGoogle();
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill demo buttons for easy beginner testing
  const setDemoCustomer = () => {
    setEmail('customer@example.com');
    setPassword('password123');
  };

  const setDemoAdmin = () => {
    setEmail('admin@supermarket.com');
    setPassword('admin12345');
  };

  return (
    <div className="auth-page-container container">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-logo-box">
            <ShoppingBag size={28} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your FreshCart account to place orders and track deliveries.</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary btn-large btn-full-width"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        {/* Google OAuth Button */}
        <button 
          type="button" 
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="google-oauth-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="google-icon">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.39 7.35 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.61 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Quick Demo Test Buttons */}
        <div className="demo-credentials-box">
          <p className="demo-hint-title">Quick Test Logins:</p>
          <div className="demo-buttons-row">
            <button type="button" onClick={setDemoCustomer} className="demo-pill-btn">
              Customer Demo
            </button>
            <button type="button" onClick={setDemoAdmin} className="demo-pill-btn admin-demo-pill">
              Admin Demo
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
