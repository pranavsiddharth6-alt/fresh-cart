import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  ArrowLeft, 
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { 
    items, 
    totalItems, 
    subtotal, 
    deliveryFee, 
    total, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container empty-cart-wrapper">
        <div className="empty-cart-card">
          <div className="empty-cart-icon-circle">
            <ShoppingBag size={54} />
          </div>
          <h2>Your grocery basket is empty</h2>
          <p>
            Explore our fresh produce, bakery, dairy, and pantry items to fill up your cart!
          </p>
          <Link to="/products" className="btn-primary btn-large">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      {/* Page Title */}
      <div className="cart-page-header">
        <div>
          <h1 className="page-heading">Your Shopping Basket</h1>
          <p className="page-subheading">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} ready for fresh local delivery
          </p>
        </div>
        <button onClick={clearCart} className="clear-cart-text-btn">
          Clear entire basket
        </button>
      </div>

      <div className="cart-layout-grid">
        {/* Left: Cart Items List */}
        <div className="cart-items-column">
          {items.map((item) => (
            <div key={item.id} className="cart-item-row">
              <Link to={`/products/${item.id}`} className="cart-item-thumb">
                <img src={item.image_url} alt={item.name} />
              </Link>

              <div className="cart-item-details">
                <Link to={`/products/${item.id}`} className="cart-item-name">
                  {item.name}
                </Link>
                <div className="cart-item-meta">
                  <span className="cart-item-unit">{item.unit || '1 item'}</span>
                  <span className="cart-item-single-price">₹{Math.round(item.price)} each</span>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="cart-item-qty-block">
                <div className="qty-counter-control">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="qty-btn"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="qty-btn"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="cart-item-subtotal">
                <span className="item-subtotal-val">
                  ₹{Math.round(item.price * item.quantity)}
                </span>
              </div>

              {/* Remove Button */}
              <button 
                onClick={() => removeFromCart(item.id)}
                className="cart-remove-btn"
                aria-label={`Remove ${item.name} from basket`}
                title="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <div className="continue-shopping-bar">
            <Link to="/products" className="continue-shopping-link">
              <ArrowLeft size={16} />
              <span>Add more fresh groceries</span>
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Card */}
        <div className="cart-summary-column">
          <div className="order-summary-card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Groceries Subtotal ({totalItems} items)</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="summary-row">
                <span className="delivery-label">
                  <Truck size={16} />
                  <span>Estimated Delivery</span>
                </span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong className="free-delivery-badge">FREE</strong>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              {subtotal < 499 && (
                <div className="free-delivery-progress-hint">
                  <span>💡 Add <strong>₹{499 - subtotal}</strong> more for <strong>FREE Delivery</strong>!</span>
                </div>
              )}

              <hr className="summary-divider" />

              <div className="summary-row total-row">
                <span>Total Due</span>
                <span className="total-amount">₹{total}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="btn-primary btn-large checkout-cta-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div className="payment-trust-notice">
              <ShieldCheck size={18} className="trust-icon" />
              <span>Cash on Delivery is available at checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
