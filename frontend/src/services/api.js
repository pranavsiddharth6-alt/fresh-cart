const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Generic API fetch helper with error handling
 */
async function fetchFromApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Add auth token or user header if available in localStorage
  const token = localStorage.getItem('supabase_auth_token');
  const storedUser = localStorage.getItem('freshcart_user');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user?.id) headers['x-user-id'] = user.id;
      if (user?.email) headers['x-user-email'] = user.email;
    } catch {
      // Ignore JSON parse error
    }
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorDetail = 'Network request failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {
      errorDetail = response.statusText || errorDetail;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Health
  getHealth: () => fetchFromApi('/health'),

  // Categories
  getCategories: () => fetchFromApi('/categories'),

  // Products
  getProducts: ({ category, search, sortBy } = {}) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    if (sortBy) params.append('sort_by', sortBy);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchFromApi(`/products${query}`);
  },

  getProductById: (id) => fetchFromApi(`/products/${id}`),

  // Orders
  createOrder: (orderData) => fetchFromApi('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),

  getOrders: (userId) => {
    const query = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
    return fetchFromApi(`/orders${query}`);
  },

  getOrderById: (id) => fetchFromApi(`/orders/${id}`),

  // Profile
  getProfile: (userId) => {
    const query = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
    return fetchFromApi(`/profile${query}`);
  },

  updateProfile: (userId, data) => {
    const query = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
    return fetchFromApi(`/profile${query}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Admin
  getAdminStats: () => fetchFromApi('/admin/stats'),

  createProduct: (productData) => fetchFromApi('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),

  updateProduct: (id, updates) => fetchFromApi(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),

  deleteProduct: (id) => fetchFromApi(`/products/${id}`, {
    method: 'DELETE'
  }),

  updateOrderStatus: (id, status) => fetchFromApi(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  })
};
