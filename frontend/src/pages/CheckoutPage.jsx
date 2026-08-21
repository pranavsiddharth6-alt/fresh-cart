import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  CheckCircle, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Banknote,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: profile?.name || user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    street: '',
    city: 'Green Valley',
    state: 'CA',
    postalCode: '90210',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // If cart is empty and no successful order yet
  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="container empty-cart-wrapper">
        <div className="empty-cart-card">
          <h2>No items to checkout</h2>
          <p>Please add products to your basket before proceeding to checkout.</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.street) {
      setError("Please fill in your name, contact phone, and delivery street address.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orderPayload = {
        user_id: user?.id || null,
        customer_name: formData.name,
        customer_email: formData.email || user?.email || 'customer@example.com',
        customer_phone: formData.phone,
        delivery_address: `${formData.street}, ${formData.city}, ${formData.state} ${formData.postalCode}`,
        total_amount: total,
        delivery_fee: deliveryFee,
        payment_method: 'Cash on Delivery',
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        }))
      };

      const res = await api.createOrder(orderPayload);
      clearCart();
      setOrderSuccess(res.order || orderPayload);
    } catch (err) {
      console.error("Order creation failed:", err);
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success Confirmation Screen
  if (orderSuccess) {
    return (
      <div className="container checkout-success-wrapper">
        <div className="success-card">
          <div className="success-icon-circle">
            <CheckCircle size={60} />
          </div>
          <span className="success-badge">Order Confirmed!</span>
          <h1>Thank you for your order!</h1>
          <p className="success-message">
            Your grocery order <strong>#{orderSuccess.id ? orderSuccess.id.substring(0, 8) : 'FC-NEW'}</strong> has been received and is being prepared by our local store team.
          </p>

          <div className="success-order-details-box">
            <div className="success-detail-row">
              <span>Customer Name:</span>
              <strong>{orderSuccess.customer_name}</strong>
            </div>
            <div className="success-detail-row">
              <span>Delivery Address:</span>
              <strong>{orderSuccess.delivery_address}</strong>
            </div>
            <div className="success-detail-row">
              <span>Payment Method:</span>
              <strong>Cash on Delivery (Pay ${total.toFixed(2)} at doorstep)</strong>
            </div>
            <div className="success-detail-row">
              <span>Estimated Delivery Time:</span>
              <strong>30 - 45 Minutes</strong>
            </div>
          </div>

          <div className="success-action-buttons">
            <Link to="/orders" className="btn-primary btn-large">
              View My Orders
            </Link>
            <Link to="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      {/* Header */}
      <div className="breadcrumb-nav">
        <Link to="/cart" className="back-link">
          <ArrowLeft size={16} />
          <span>Return to shopping basket</span>
        </Link>
      </div>

      <h1 className="page-heading">Delivery & Checkout</h1>
      <p className="page-subheading">
        Confirm your local delivery address and payment details.
      </p>

      {error && (
        <div className="error-alert-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="checkout-grid">
        {/* Left Column: Delivery Details Form */}
        <div className="checkout-form-column">
          <div className="checkout-card">
            <div className="card-header-with-icon">
              <MapPin className="header-icon" size={22} />
              <div>
                <h2>1. Local Delivery Address</h2>
                <p>Where should our delivery rider bring your groceries?</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="name">Recipient Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number (for delivery rider) *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 (555) 019-2834"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address (for order receipt)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. alex@example.com"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="street">Street Address & Apartment/House # *</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="e.g. 452 Elm Street, Apt 3B"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City / Area</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="checkout-card" style={{ marginTop: '1.5rem' }}>
            <div className="card-header-with-icon">
              <Banknote className="header-icon" size={22} />
              <div>
                <h2>2. Payment Method</h2>
                <p>Convenient and risk-free payment upon delivery</p>
              </div>
            </div>

            <div className="payment-option-box selected">
              <input 
                type="radio" 
                id="cod" 
                name="payment" 
                checked 
                readOnly 
              />
              <label htmlFor="cod" className="payment-radio-label">
                <div className="payment-title-row">
                  <strong>💵 Cash on Delivery (COD)</strong>
                  <span className="payment-badge-pill">Selected</span>
                </div>
                <p className="payment-desc">
                  Inspect your groceries first and pay the exact amount with cash when the delivery agent arrives at your door.
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review */}
        <div className="checkout-summary-column">
          <div className="order-summary-card">
            <h3 className="summary-title">Review Items ({items.length})</h3>

            <div className="checkout-items-list">
              {items.map((item) => (
                <div key={item.id} className="checkout-item-preview">
                  <img src={item.image_url} alt={item.name} />
                  <div className="checkout-item-info">
                    <span className="item-title">{item.name}</span>
                    <span className="item-qty-price">{item.quantity} × ₹{Math.round(item.price)}</span>
                  </div>
                  <span className="item-line-total">
                    ₹{Math.round(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? <strong className="free-delivery-badge">FREE</strong> : `₹${deliveryFee}`}
                </span>
              </div>
              <hr className="summary-divider" />
              <div className="summary-row total-row">
                <span>Total Amount Due</span>
                <span className="total-amount">₹{total}</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary btn-large checkout-cta-btn"
            >
              {loading ? (
                <span>Placing Order...</span>
              ) : (
                <span>Place Order (₹{total})</span>
              )}
            </button>

            <div className="security-guarantee-note">
              <ShieldCheck size={16} />
              <span>Safe & reliable doorstep delivery guaranteed</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
