/**
 * Centralized API Service for FreshCart Supermarket
 * Ensures all requests correctly target the '/api' backend prefix.
 */

// Base URL resolution: auto-ensures '/api' prefix regardless of how VITE_API_URL is supplied
const rawApiUrl = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
).trim().replace(/\/+$/, '');

// If VITE_API_URL is supplied without '/api' (e.g. 'https://fresh-cart-ns78.onrender.com'), append '/api'
export const API_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

/**
 * Generic API fetch helper with error handling and auth headers
 * Guarantees every outbound request goes to ${API_BASE_URL}/...
 */
async function fetchFromApi(endpoint, options = {}) {
  // Normalize endpoint: ensure leading slash and strip duplicate /api if present
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (cleanEndpoint.startsWith('/api/')) {
    cleanEndpoint = cleanEndpoint.substring(4); // Avoid double /api/api
  }

  const url = `${API_BASE_URL}${cleanEndpoint}`;
  
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
  // Base URL
  baseUrl: API_BASE_URL,

  // Health -> GET /api/health
  getHealth: () => fetchFromApi('/health'),

  // Categories -> GET /api/categories
  getCategories: () => fetchFromApi('/categories'),

  // Products -> GET /api/products, GET /api/products/:id
  getProducts: ({ category, search, sortBy } = {}) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    if (sortBy) params.append('sort_by', sortBy);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchFromApi(`/products${query}`);
  },

  getProductById: (id) => fetchFromApi(`/products/${id}`),

  // Orders -> POST /api/orders, GET /api/orders, GET /api/orders/:id
  createOrder: (orderData) => fetchFromApi('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),

  getOrders: (userId) => {
    const query = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
    return fetchFromApi(`/orders${query}`);
  },

  getOrderById: (id) => fetchFromApi(`/orders/${id}`),

  // Profile -> GET /api/profile, PUT /api/profile
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

  // Admin -> GET /api/admin/stats, POST /api/products, PUT /api/products/:id, DELETE /api/products/:id, PUT /api/orders/:id/status
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
