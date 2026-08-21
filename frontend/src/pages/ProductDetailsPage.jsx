import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  PackageCheck,
  Leaf
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);
        setQuantity(1);

        const data = await api.getProductById(id);
        setProduct(data);

        // Load related category products
        if (data?.category_id) {
          const catRes = await api.getProducts({ category: data.category_id });
          if (catRes?.products) {
            setRelatedProducts(
              catRes.products.filter((p) => p.id !== data.id).slice(0, 4)
            );
          }
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError("This product could not be found or is no longer available.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="container page-loading-spinner">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container error-page-wrapper">
        <div className="error-card">
          <h2>Product Not Found</h2>
          <p>{error || "We couldn't find the item you're looking for."}</p>
          <Link to="/products" className="btn-primary">
            <ArrowLeft size={16} />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const inCart = items.find((item) => item.id === product.id);

  return (
    <div className="product-details-page container">
      {/* Breadcrumb / Back Link */}
      <div className="breadcrumb-nav">
        <Link to="/products" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to all products</span>
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-category">{product.category_id}</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      {/* Main Product Showcase */}
      <div className="product-details-grid">
        {/* Left: Product Image */}
        <div className="product-details-gallery">
          <div className="details-image-card">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="details-main-image"
            />
            {product.is_featured && (
              <span className="details-badge badge-featured">Popular Pick</span>
            )}
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="product-details-info">
          <div className="details-header">
            <span className="details-category-tag">{product.category_id}</span>
            <h1 className="details-title">{product.name}</h1>
            {product.unit && <p className="details-unit">Pack Size: {product.unit}</p>}
          </div>

          {/* Price Box */}
          <div className="details-price-row">
            <span className="details-currency">₹</span>
            <span className="details-price">{Math.round(Number(product.price))}</span>
            <span className="details-tax-note">(Inclusive of all local taxes)</span>
          </div>

          {/* Stock Status Badge */}
          <div className="stock-status-row">
            {isOutOfStock ? (
              <span className="status-badge status-out">❌ Out of Stock</span>
            ) : product.stock <= 5 ? (
              <span className="status-badge status-warning">⚠️ Only {product.stock} left in stock</span>
            ) : (
              <span className="status-badge status-available">✅ In Stock ({product.stock} available)</span>
            )}
          </div>

          {/* Description */}
          <div className="details-desc-box">
            <h3>About this item</h3>
            <p>{product.description || "Fresh and premium quality grocery product sourced from certified local farms and suppliers."}</p>
          </div>

          {/* Quantity & Add to Cart Controls */}
          {!isOutOfStock && (
            <div className="purchase-action-panel">
              <div className="quantity-picker">
                <span className="qty-picker-label">Quantity:</span>
                <div className="qty-picker-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="qty-btn"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="qty-btn"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                className="btn-primary btn-large add-to-cart-cta"
              >
                <ShoppingCart size={20} />
                <span>
                  Add {quantity} to Cart • ₹{Math.round(Number(product.price) * quantity)}
                </span>
              </button>
            </div>
          )}

          {inCart && (
            <div className="incart-indicator">
              <PackageCheck size={18} />
              <span>You currently have {inCart.quantity} of this item in your <Link to="/cart">Cart</Link>.</span>
            </div>
          )}

          {/* Store Promises */}
          <div className="product-assurances">
            <div className="assurance-item">
              <Truck size={20} className="assurance-icon" />
              <div>
                <strong>Express Doorstep Delivery</strong>
                <p>Delivered within 30-45 minutes at your location</p>
              </div>
            </div>
            <div className="assurance-item">
              <Leaf size={20} className="assurance-icon" />
              <div>
                <strong>Guaranteed Freshness</strong>
                <p>100% replacement or refund if you are not satisfied</p>
              </div>
            </div>
            <div className="assurance-item">
              <ShieldCheck size={20} className="assurance-icon" />
              <div>
                <strong>Cash on Delivery</strong>
                <p>Pay conveniently when your order arrives at your door</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Similar Items</span>
              <h2 className="section-title">You Might Also Like</h2>
            </div>
          </div>
          <div className="products-grid">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
