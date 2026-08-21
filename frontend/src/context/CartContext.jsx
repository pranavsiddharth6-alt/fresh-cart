import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('freshcart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notification, setNotification] = useState(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('freshcart_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 2800);
  };

  const addToCart = (product, quantity = 1) => {
    if (!product || quantity <= 0) return;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image_url: product.image_url,
            unit: product.unit || '1 item',
            category_id: product.category_id,
            quantity: quantity
          }
        ];
      }
    });

    showNotification(`Added ${quantity} × ${product.name} to cart!`);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  // Computations
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Free delivery above ₹499, otherwise ₹40
  const deliveryFee = subtotal > 0 && subtotal < 499 ? 40 : 0;
  const total = subtotal + deliveryFee;

  const value = {
    items,
    totalItems,
    subtotal: Math.round(subtotal),
    deliveryFee: Math.round(deliveryFee),
    total: Math.round(total),
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    notification
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {notification && (
        <div className="toast-notification">
          <span>🌿 {notification}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
