import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, profile, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="site-header">
      {/* Top Utility Bar */}
      <div className="top-banner">
        <div className="container top-banner-content">
          <span>🥦 Fresh local groceries delivered to your doorstep in 30 minutes!</span>
          <span className="top-banner-perk">Free delivery on orders over ₹499</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="main-nav">
        <div className="container nav-container">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="logo-icon-box">
              <ShoppingBag className="logo-icon" size={24} />
            </div>
            <div className="logo-text-group">
              <span className="brand-name">FreshCart</span>
              <span className="brand-tagline">Local Supermarket</span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form className="nav-search-form" onSubmit={handleSearch}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search fruits, milk, veggies, bakery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </form>

          {/* Nav Links & Actions (Desktop) */}
          <div className="nav-actions">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>

            <Link 
              to="/products" 
              className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
            >
              Products
            </Link>

            {/* Admin Badge link if admin */}
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`admin-nav-badge ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
              >
                <ShieldCheck size={16} />
                <span>Admin</span>
              </Link>
            )}

            {/* User Profile / Login */}
            {user ? (
              <div className="user-menu-container">
                <button 
                  className="user-menu-button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                >
                  <div className="user-avatar-circle">
                    {(profile?.name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="user-menu-name">
                    {profile?.name || user.email?.split('@')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="user-dropdown-menu" onMouseLeave={() => setUserDropdownOpen(false)}>
                    <div className="dropdown-header">
                      <p className="dropdown-user-name">{profile?.name || 'Customer'}</p>
                      <p className="dropdown-user-email">{user.email}</p>
                    </div>
                    <hr className="dropdown-divider" />
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User size={16} />
                      <span>My Profile</span>
                    </Link>
                    <Link 
                      to="/orders" 
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Package size={16} />
                      <span>My Orders</span>
                    </Link>
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <ShieldCheck size={16} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <hr className="dropdown-divider" />
                    <button className="dropdown-item logout-action" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-link-button">
                <User size={18} />
                <span>Sign In</span>
              </Link>
            )}

            {/* Cart Button */}
            <Link to="/cart" className="cart-nav-button" aria-label="Shopping Cart">
              <ShoppingCart size={20} />
              <span className="cart-label">Cart</span>
              {totalItems > 0 && (
                <span className="cart-badge-count">{totalItems}</span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer">
            <form className="mobile-search-form" onSubmit={handleSearch}>
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">Go</button>
            </form>

            <div className="mobile-nav-links">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/products" onClick={() => setMobileMenuOpen(false)}>Products</Link>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>Cart ({totalItems})</Link>
              
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
                  )}
                  <button className="mobile-logout-btn" onClick={handleLogout}>
                    Sign Out ({user.email})
                  </button>
                </>
              ) : (
                <Link to="/login" className="mobile-login-btn" onClick={() => setMobileMenuOpen(false)}>
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
