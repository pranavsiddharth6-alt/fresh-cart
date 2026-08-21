import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Check, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { items, addToCart, updateQuantity } = useCart();

  const cartItem = items.find((item) => item.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="product-card">
      {/* Product Image Box */}
      <Link to={`/products/${product.id}`} className="product-image-wrapper">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {product.is_featured && (
          <span className="product-badge badge-featured">Popular</span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="product-badge badge-lowstock">Only {product.stock} left</span>
        )}
      </Link>

      {/* Content Area */}
      <div className="product-card-body">
        <div className="product-category-unit">
          <span className="product-category">{product.category_id}</span>
          {product.unit && <span className="product-unit">• {product.unit}</span>}
        </div>

        <Link to={`/products/${product.id}`} className="product-title">
          <h3>{product.name}</h3>
        </Link>

        {product.description && (
          <p className="product-card-desc">
            {product.description.length > 55 
              ? `${product.description.substring(0, 55)}...` 
              : product.description}
          </p>
        )}

        {/* Price & Action Row */}
        <div className="product-footer">
          <div className="product-price-block">
            <span className="product-currency">₹</span>
            <span className="product-price">{Math.round(Number(product.price))}</span>
          </div>

          {/* Cart Buttons */}
          <div className="product-actions">
            {isOutOfStock ? (
              <span className="out-of-stock-pill">Out of Stock</span>
            ) : inCartQty > 0 ? (
              <div className="qty-counter-control">
                <button 
                  onClick={() => updateQuantity(product.id, inCartQty - 1)}
                  className="qty-btn"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-display">{inCartQty}</span>
                <button 
                  onClick={() => updateQuantity(product.id, inCartQty + 1)}
                  className="qty-btn"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => addToCart(product, 1)}
                className="add-cart-btn"
                aria-label={`Add ${product.name} to cart`}
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
