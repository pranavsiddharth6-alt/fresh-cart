import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  AlertTriangle, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Eye,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { api } from '../services/api';

const CATEGORIES = [
  { id: 'fruits', name: 'Fruits' },
  { id: 'vegetables', name: 'Vegetables' },
  { id: 'dairy', name: 'Dairy & Eggs' },
  { id: 'groceries', name: 'Pantry & Groceries' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'snacks', name: 'Snacks & Bakery' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  const [stats, setStats] = useState({ total_products: 0, total_orders: 0, total_revenue: 0, low_stock_count: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category_id: 'fruits',
    description: '',
    price: '',
    unit: '1 kg',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
    stock: 50,
    is_featured: false
  });

  const [filterSearch, setFilterSearch] = useState('');

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        api.getAdminStats().catch(() => ({ total_products: 0, total_orders: 0, total_revenue: 0, low_stock_count: 0 })),
        api.getProducts(),
        api.getOrders()
      ]);

      setStats(statsRes);
      setProducts(productsRes?.products || []);
      setOrders(ordersRes?.orders || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('Could not load administrative data.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Open modal for adding
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category_id: 'fruits',
      description: '',
      price: '',
      unit: '1 kg',
      image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
      stock: 50,
      is_featured: false
    });
    setIsProductModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category_id: product.category_id,
      description: product.description || '',
      price: product.price,
      unit: product.unit || '1 item',
      image_url: product.image_url,
      stock: product.stock,
      is_featured: product.is_featured || false
    });
    setIsProductModalOpen(true);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update
        const res = await api.updateProduct(editingProduct.id, {
          name: productForm.name,
          category_id: productForm.category_id,
          description: productForm.description,
          price: parseFloat(productForm.price),
          unit: productForm.unit,
          image_url: productForm.image_url,
          stock: parseInt(productForm.stock),
          is_featured: productForm.is_featured
        });
        showSuccess(`Updated "${productForm.name}" successfully!`);
      } else {
        // Create
        await api.createProduct({
          name: productForm.name,
          category_id: productForm.category_id,
          description: productForm.description,
          price: parseFloat(productForm.price),
          unit: productForm.unit,
          image_url: productForm.image_url,
          stock: parseInt(productForm.stock),
          is_featured: productForm.is_featured
        });
        showSuccess(`Created "${productForm.name}" in catalog!`);
      }
      setIsProductModalOpen(false);
      loadAllAdminData();
    } catch (err) {
      console.error('Save product error:', err);
      alert(err.message || 'Failed to save product.');
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to remove "${productName}" from the catalog?`)) {
      return;
    }
    try {
      await api.deleteProduct(productId);
      showSuccess(`Deleted "${productName}" from store.`);
      loadAllAdminData();
    } catch (err) {
      console.error('Delete product error:', err);
      alert(err.message || 'Failed to delete product.');
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showSuccess(`Order status updated to "${newStatus}"!`);
      loadAllAdminData();
    } catch (err) {
      console.error('Update order status error:', err);
      alert(err.message || 'Failed to update order status.');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(filterSearch.toLowerCase()) || 
    p.category_id.toLowerCase().includes(filterSearch.toLowerCase())
  );

  return (
    <div className="admin-page container">
      {/* Admin Top Header */}
      <div className="admin-header-row">
        <div>
          <div className="admin-title-badge">
            <ShieldCheck size={20} />
            <span>Store Administrator Panel</span>
          </div>
          <h1 className="page-heading">Supermarket Operations</h1>
          <p className="page-subheading">Manage catalog items, monitor inventory, and fulfill customer deliveries.</p>
        </div>

        <button onClick={loadAllAdminData} className="btn-secondary">
          <RefreshCw size={16} />
          <span>Refresh Data</span>
        </button>
      </div>

      {successMsg && (
        <div className="success-alert-banner">
          <Check size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="error-alert-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon-box stat-primary">
            <Package size={24} />
          </div>
          <div>
            <span className="stat-label">Total Products</span>
            <h3 className="stat-value">{stats.total_products || products.length}</h3>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-box stat-secondary">
            <ShoppingBag size={24} />
          </div>
          <div>
            <span className="stat-label">Total Customer Orders</span>
            <h3 className="stat-value">{stats.total_orders || orders.length}</h3>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-box stat-success">
            <DollarSign size={24} />
          </div>
          <div>
            <span className="stat-label">Total Store Revenue</span>
            <h3 className="stat-value">₹{Math.round(stats.total_revenue || 0)}</h3>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-box stat-warning">
            <AlertTriangle size={24} />
          </div>
          <div>
            <span className="stat-label">Low Stock Alerts</span>
            <h3 className="stat-value">{stats.low_stock_count || 0}</h3>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs-bar">
        <button 
          onClick={() => setActiveTab('products')} 
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
        >
          <Package size={18} />
          <span>Products Catalog ({products.length})</span>
        </button>

        <button 
          onClick={() => setActiveTab('orders')} 
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
        >
          <ShoppingBag size={18} />
          <span>Customer Orders ({orders.length})</span>
        </button>
      </div>

      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="admin-section-card">
          <div className="admin-section-header">
            <div className="admin-search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="admin-search-input"
              />
            </div>

            <button onClick={handleOpenAddModal} className="btn-primary">
              <Plus size={18} />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>Price</th>
                  <th>Stock Inventory</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="table-product-cell">
                        <img src={p.image_url} alt={p.name} className="table-thumb" />
                        <div>
                          <strong>{p.name}</strong>
                          {p.is_featured && <span className="featured-tag">Popular</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-pill-small">{p.category_id}</span>
                    </td>
                    <td>{p.unit || '1 item'}</td>
                    <td><strong>₹{Math.round(Number(p.price))}</strong></td>
                    <td>
                      <span className={`stock-number-pill ${p.stock <= 5 ? 'low-stock' : 'in-stock'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td>
                      {p.stock > 0 ? (
                        <span className="badge-pill-available">Available</span>
                      ) : (
                        <span className="badge-pill-out">Out of stock</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button 
                          onClick={() => handleOpenEditModal(p)}
                          className="table-action-btn edit-btn"
                          title="Edit product"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="table-action-btn delete-btn"
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="admin-section-card">
          <div className="admin-section-header">
            <h3>Recent Store Orders</h3>
            <span>Total: {orders.length} orders</span>
          </div>

          {orders.length === 0 ? (
            <div className="empty-catalog-box">
              <p>No customer orders placed yet.</p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Details</th>
                    <th>Delivery Address</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status & Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <strong>#{o.id ? o.id.substring(0, 8).toUpperCase() : 'FC'}</strong>
                      </td>
                      <td>
                        <div className="customer-info-cell">
                          <strong>{o.customer_name}</strong>
                          <span>{o.customer_phone}</span>
                          <span className="muted-email">{o.customer_email}</span>
                        </div>
                      </td>
                      <td className="address-cell">
                        {o.delivery_address}
                      </td>
                      <td>
                        <span className="items-count-badge">
                          {o.items ? o.items.length : 0} items
                        </span>
                      </td>
                      <td>
                        <strong>₹{Math.round(Number(o.total_amount))}</strong>
                        <div className="payment-method-label">{o.payment_method || 'COD'}</div>
                      </td>
                      <td className="date-cell">
                        {o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Today'}
                      </td>
                      <td>
                        <select 
                          value={o.status || 'Pending'}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className={`order-status-select status-${(o.status || 'pending').toLowerCase().replace(/\s+/g, '')}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content-box">
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Supermarket Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsProductModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="modal-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Organic Fresh Strawberries"
                  required
                />
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Unit / Pack Size</label>
                  <input
                    type="text"
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="e.g. 500g, 1 kg, 1 Liter"
                  />
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="99"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Initial Stock Inventory *</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="50"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL (Direct link to high-res photo)</label>
                <input
                  type="url"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={3}
                  placeholder="Short description of taste, origin, and packaging..."
                />
              </div>

              <div className="form-checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    checked={productForm.is_featured}
                    onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                  />
                  <span>Feature on Homepage / Daily Deals</span>
                </label>
              </div>

              <div className="modal-footer-buttons">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
