import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page-loading-spinner">
        <div className="spinner"></div>
        <p>Verifying authentication...</p>
      </div>
    );
  }

  // If page requires admin rights
  if (adminOnly) {
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (!isAdmin) {
      return (
        <div className="container error-page-wrapper">
          <div className="error-card">
            <h2>Access Restricted</h2>
            <p>You need administrator privileges to view this page.</p>
            <a href="/" className="btn-primary">Return to Home</a>
          </div>
        </div>
      );
    }
    return children;
  }

  // If standard authenticated page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
