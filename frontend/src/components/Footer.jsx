import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Shield, Truck, Clock, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Service Highlights */}
      <div className="footer-highlights">
        <div className="container highlights-grid">
          <div className="highlight-card">
            <Truck className="highlight-icon" size={28} />
            <div>
              <h4>Superfast Local Delivery</h4>
              <p>Fresh groceries delivered within 30-45 minutes</p>
            </div>
          </div>
          <div className="highlight-card">
            <Shield className="highlight-icon" size={28} />
            <div>
              <h4>100% Quality Guarantee</h4>
              <p>Directly sourced from trusted local farmers</p>
            </div>
          </div>
          <div className="highlight-card">
            <Clock className="highlight-icon" size={28} />
            <div>
              <h4>Open 7 Days a Week</h4>
              <p>7:00 AM – 10:00 PM every single day</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer-main">
        <div className="container footer-grid">
          {/* Col 1: About */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <ShoppingBag className="footer-logo-icon" size={22} />
              <span>FreshCart Supermarket</span>
            </div>
            <p className="footer-about-text">
              Your friendly neighbourhood grocery store. Bringing farm-fresh produce, dairy, bakery, and daily staples right to your doorstep.
            </p>
            <div className="footer-contact-item">
              <MapPin size={16} />
              <span>123 Market Street, Green Valley</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={16} />
              <span>+1 (555) 373-7422</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={16} />
              <span>help@freshcartsupermarket.com</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Shop</h4>
            <ul className="footer-links">
              <li><Link to="/products?category=fruits">Fresh Fruits</Link></li>
              <li><Link to="/products?category=vegetables">Organic Vegetables</Link></li>
              <li><Link to="/products?category=dairy">Dairy & Eggs</Link></li>
              <li><Link to="/products?category=groceries">Pantry & Grains</Link></li>
              <li><Link to="/products?category=beverages">Beverages</Link></li>
              <li><Link to="/products?category=snacks">Bakery & Snacks</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="footer-col">
            <h4 className="footer-heading">Customer Care</h4>
            <ul className="footer-links">
              <li><Link to="/profile">My Account</Link></li>
              <li><Link to="/orders">Track My Order</Link></li>
              <li><Link to="/cart">Shopping Basket</Link></li>
              <li><a href="#help" onClick={(e) => { e.preventDefault(); alert("Help Center: Support is available 7 days a week at help@freshcartsupermarket.com"); }}>Help & FAQ</a></li>
              <li><a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Service: Freshness guaranteed on all items."); }}>Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Col 4: Payment & Local Store */}
          <div className="footer-col">
            <h4 className="footer-heading">Payment & Trust</h4>
            <p className="footer-subtext">
              We currently accept safe and hassle-free <strong>Cash on Delivery (COD)</strong> at your doorstep.
            </p>
            <div className="payment-badge">
              <span>💵 Cash on Delivery Available</span>
            </div>
            <div className="payment-badge" style={{ marginTop: '0.5rem' }}>
              <span>🔒 100% Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="footer-bottom">
        <div className="container bottom-content">
          <p>© {new Date().getFullYear()} FreshCart Supermarket. All rights reserved.</p>
          <p className="footer-credits">
            Built with React, FastAPI & Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
