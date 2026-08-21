import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Leaf, 
  Truck, 
  ShieldCheck, 
  RefreshCw,
  ShoppingBag,
  Clock
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';

const CATEGORY_ITEMS = [
  { id: 'fruits', name: 'Fresh Fruits', icon: '🍎', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&auto=format&fit=crop&q=80' },
  { id: 'vegetables', name: 'Organic Veggies', icon: '🥦', image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400&auto=format&fit=crop&q=80' },
  { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛', image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=400&auto=format&fit=crop&q=80' },
  { id: 'groceries', name: 'Pantry & Rice', icon: '🌾', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80' },
  { id: 'beverages', name: 'Cold Drinks & Juice', icon: '🧃', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&auto=format&fit=crop&q=80' },
  { id: 'snacks', name: 'Snacks & Bakery', icon: '🍪', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80' },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendHealthy, setBackendHealthy] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        // Load products
        const data = await api.getProducts();
        if (data?.products) {
          const featured = data.products.filter(p => p.is_featured).slice(0, 8);
          setFeaturedProducts(featured.length > 0 ? featured : data.products.slice(0, 8));
        }
      } catch (err) {
        console.error("Error loading home products:", err);
        setBackendHealthy(false);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>100% Farm Fresh & Pure</span>
            </div>
            <h1 className="hero-title">
              Fresh groceries, right at your <span className="highlight-text">doorstep.</span>
            </h1>
            <p className="hero-subtitle">
              Order farm-picked fruits, crisp vegetables, whole dairy, and pantry essentials from your neighbourhood supermarket in minutes.
            </p>
            <div className="hero-button-group">
              <Link to="/products" className="btn-primary btn-large">
                <span>Shop Now</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/products?category=fruits" className="btn-secondary btn-large">
                View Daily Deals
              </Link>
            </div>

            {/* Quick trust metric badges */}
            <div className="hero-perks-row">
              <div className="hero-perk-item">
                <Truck size={18} className="perk-icon" />
                <span>30-min Delivery</span>
              </div>
              <div className="hero-perk-item">
                <Leaf size={18} className="perk-icon" />
                <span>Organic Guarantee</span>
              </div>
              <div className="hero-perk-item">
                <ShieldCheck size={18} className="perk-icon" />
                <span>Cash on Delivery</span>
              </div>
            </div>
          </div>

          <div className="hero-image-card">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80" 
              alt="Fresh supermarket vegetables basket"
              className="hero-main-img"
            />
            <div className="hero-floating-card floating-card-top">
              <span className="floating-emoji">🥑</span>
              <div>
                <strong>Farm Fresh</strong>
                <p>Picked today morning</p>
              </div>
            </div>
            <div className="hero-floating-card floating-card-bottom">
              <span className="floating-emoji">⚡</span>
              <div>
                <strong>30 Mins Express</strong>
                <p>Free on orders &gt; ₹499</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop By Categories */}
      <section className="section-categories">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Explore Aisles</span>
              <h2 className="section-title">Shop by Category</h2>
            </div>
            <Link to="/products" className="view-all-link">
              <span>View All Categories</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="categories-grid">
            {CATEGORY_ITEMS.map((cat) => (
              <Link 
                to={`/products?category=${cat.id}`} 
                key={cat.id} 
                className="category-card"
              >
                <div className="category-img-box">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                  <span className="category-emoji-badge">{cat.icon}</span>
                </div>
                <h3 className="category-name">{cat.name}</h3>
                <span className="category-explore-hint">Browse products →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="section-featured">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Daily Picks</span>
              <h2 className="section-title">Featured Supermarket Essentials</h2>
            </div>
            <Link to="/products" className="view-all-link">
              <span>See Full Catalog</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton-product-card"></div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-catalog-box">
              <p>Products are loading or backend catalog is synchronizing.</p>
              <Link to="/products" className="btn-primary">Browse All Products</Link>
            </div>
          )}
        </div>
      </section>

      {/* 4. Promotional Banner */}
      <section className="promo-banner-section">
        <div className="container">
          <div className="promo-banner-card">
            <div className="promo-content">
              <span className="promo-pill">Weekend Special Offer</span>
              <h2 className="promo-title">Save up to 25% on Organic Farm Fruits & Dairy</h2>
              <p className="promo-desc">
                Stock your kitchen with fresh vitamins and crisp produce. Enjoy free contactless doorstep delivery and easy Cash on Delivery.
              </p>
              <Link to="/products?category=fruits" className="btn-primary btn-white">
                Shop Fresh Produce Now
              </Link>
            </div>
            <div className="promo-visual">
              <img 
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80" 
                alt="Assorted juicy fresh fruits"
                className="promo-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works / Local Trust Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="text-center-header">
            <span className="section-subtitle">Effortless Shopping</span>
            <h2 className="section-title">How FreshCart Works</h2>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Choose Groceries</h3>
              <p>Browse fresh fruits, vegetables, dairy, bakery and pantry items from our catalog.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Fast Checkout</h3>
              <p>Enter your local delivery address and choose Cash on Delivery at your door.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>30-Min Doorstep Delivery</h3>
              <p>Our store pickers hand-select the freshest items and deliver directly to your home.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
