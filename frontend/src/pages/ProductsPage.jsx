import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, X, PackageOpen } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';

const CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'fruits', name: '🍎 Fruits' },
  { id: 'vegetables', name: '🥦 Vegetables' },
  { id: 'dairy', name: '🥛 Dairy & Eggs' },
  { id: 'groceries', name: '🌾 Pantry & Grains' },
  { id: 'beverages', name: '🧃 Beverages' },
  { id: 'snacks', name: '🍪 Snacks & Bakery' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read URL parameters
  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  const [searchInput, setSearchInput] = useState(currentSearch);

  // Sync search input with URL search param
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Fetch products when query params change
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getProducts({
          category: currentCategory,
          search: currentSearch,
          sortBy: currentSort
        });
        setProducts(data?.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Unable to load grocery catalog. Please check backend connection.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [currentCategory, currentSearch, currentSort]);

  const handleCategoryChange = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (catId === 'all') {
      params.delete('category');
    } else {
      params.set('category', catId);
    }
    setSearchParams(params);
  };

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="products-page container">
      {/* Page Header */}
      <div className="products-page-header">
        <div>
          <h1 className="page-heading">Supermarket Catalog</h1>
          <p className="page-subheading">
            Browse our freshest aisles and pantry favorites directly from the store.
          </p>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="catalog-toolbar">
          <form className="products-search-bar" onSubmit={handleSearchSubmit}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="toolbar-search-input"
            />
            {searchInput && (
              <button 
                type="button" 
                className="clear-search-btn" 
                onClick={() => { setSearchInput(''); handleCategoryChange(currentCategory); }}
              >
                <X size={16} />
              </button>
            )}
            <button type="submit" className="toolbar-search-btn">Search</button>
          </form>

          {/* Sort Dropdown */}
          <div className="sort-wrapper">
            <ArrowUpDown size={16} className="sort-icon" />
            <select 
              value={currentSort} 
              onChange={handleSortChange} 
              className="sort-select"
              aria-label="Sort products"
            >
              <option value="newest">Featured & Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="category-pills-row">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`category-pill ${currentCategory === cat.id ? 'active' : ''}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Active Filter Indicators */}
      {(currentSearch || (currentCategory && currentCategory !== 'all')) && (
        <div className="active-filters-bar">
          <span className="filters-label">Active Filters:</span>
          {currentCategory !== 'all' && (
            <span className="filter-tag">
              Category: {currentCategory}
              <button onClick={() => handleCategoryChange('all')}>×</button>
            </span>
          )}
          {currentSearch && (
            <span className="filter-tag">
              Search: "{currentSearch}"
              <button onClick={() => { setSearchInput(''); const p = new URLSearchParams(searchParams); p.delete('search'); setSearchParams(p); }}>×</button>
            </span>
          )}
          <button onClick={clearFilters} className="clear-all-link">Clear all</button>
        </div>
      )}

      {/* Products Content */}
      {loading ? (
        <div className="loading-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="skeleton-product-card"></div>
          ))}
        </div>
      ) : error ? (
        <div className="error-message-box">
          <p>{error}</p>
          <button onClick={clearFilters} className="btn-primary">Reset Filters</button>
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="products-count-bar">
            <span>Showing <strong>{products.length}</strong> items</span>
          </div>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-catalog-box">
          <PackageOpen size={48} className="empty-icon" />
          <h3>No matching groceries found</h3>
          <p>We couldn't find any products matching your search or category filter.</p>
          <button onClick={clearFilters} className="btn-primary">
            View All Products
          </button>
        </div>
      )}
    </div>
  );
}
