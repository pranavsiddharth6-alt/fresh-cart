import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  ShoppingBag,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getOrders(user?.id);
        setOrders(data?.orders || []);
      } catch (err) {
        console.error("Error loading orders:", err);
        setError("Could not load your order history. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user]);

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'out for delivery':
      case 'processing':
        return 'status-processing';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle2 size={16} />;
      case 'out for delivery':
        return <Truck size={16} />;
      case 'processing':
        return <RefreshCw size={16} />;
      case 'cancelled':
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className="orders-page container">
      {/* Page Header */}
      <div className="orders-header">
        <div>
          <h1 className="page-heading">My Grocery Orders</h1>
          <p className="page-subheading">
            Track and review your recent orders and delivery status.
          </p>
        </div>
        <Link to="/products" className="btn-secondary">
          <span>Continue Shopping</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="page-loading-spinner">
          <div className="spinner"></div>
          <p>Fetching your orders...</p>
        </div>
      ) : error ? (
        <div className="error-message-box">
          <p>{error}</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              {/* Order Card Header */}
              <div className="order-card-top">
                <div className="order-id-date">
                  <div className="order-id-group">
                    <Package size={20} className="order-icon" />
                    <strong>Order #{order.id ? order.id.substring(0, 8).toUpperCase() : 'UNKNOWN'}</strong>
                  </div>
                  <span className="order-date">
                    {order.created_at 
                      ? new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Just now'}
                  </span>
                </div>

                <div className={`order-status-badge ${getStatusBadgeClass(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span>{order.status || 'Pending'}</span>
                </div>
              </div>

              {/* Order Summary & Customer Info */}
              <div className="order-details-info-row">
                <div>
                  <span className="order-meta-label">Delivering to:</span>
                  <p className="order-meta-value">{order.delivery_address || 'Local Delivery'}</p>
                </div>
                <div>
                  <span className="order-meta-label">Payment:</span>
                  <p className="order-meta-value">{order.payment_method || 'Cash on Delivery'}</p>
                </div>
                <div>
                  <span className="order-meta-label">Total Amount:</span>
                  <p className="order-total-price">₹{Math.round(Number(order.total_amount))}</p>
                </div>
              </div>

              {/* Items List */}
              {order.items && order.items.length > 0 && (
                <div className="order-items-table">
                  <h4>Items in this order:</h4>
                  <div className="order-items-tags">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item-pill">
                        <span className="order-item-qty">{item.quantity}×</span>
                        <span className="order-item-title">{item.product_name || item.name}</span>
                        <span className="order-item-price">₹{Math.round(Number(item.price))}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-orders-card">
          <ShoppingBag size={56} className="empty-icon" />
          <h2>No orders placed yet</h2>
          <p>
            When you purchase fresh groceries and pantry essentials, your order receipt and tracking status will appear here.
          </p>
          <Link to="/products" className="btn-primary btn-large">
            Browse Supermarket Products
          </Link>
        </div>
      )}
    </div>
  );
}
