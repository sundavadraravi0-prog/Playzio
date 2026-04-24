import axios from 'axios';

const API = axios.create({
  baseURL: 'https://playzio-z3uc.onrender.com/api',
  withCredentials: true
});

// Request interceptor to add access token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRequest = originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/register');
    
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/auth/refresh` : '/api/auth/refresh';
        const { data } = await axios.post(refreshUrl, {}, { withCredentials: true });
        localStorage.setItem('accessToken', data.accessToken);
        API.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        processQueue(null, data.accessToken);
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  refresh: () => API.post('/auth/refresh'),
  logout: () => API.post('/auth/logout'),
};

// User API
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  changePassword: (data) => API.put('/users/password', data),
  getWishlist: () => API.get('/users/wishlist'),
  toggleWishlist: (productId) => API.post(`/users/wishlist/${productId}`),
};

// Product API
export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getFeatured: () => API.get('/products/featured'),
  getCategories: () => API.get('/products/categories'),
  getOne: (id) => API.get(`/products/${id}`),
};

// Order API
export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getAll: () => API.get('/orders'),
  getOne: (id) => API.get(`/orders/${id}`),
};

// Bill API
export const billAPI = {
  getAll: () => API.get('/bills'),
  getOne: (id) => API.get(`/bills/${id}`),
};

// Cart API
export const cartAPI = {
  get: () => API.get('/cart'),
  add: (productId, quantity = 1) => API.post('/cart', { productId, quantity }),
  update: (productId, quantity) => API.put(`/cart/${productId}`, { quantity }),
  remove: (productId) => API.delete(`/cart/${productId}`),
  clear: () => API.delete('/cart'),
};

// Review API
export const reviewAPI = {
  create: (data) => API.post('/reviews', data),
  getByProduct: (productId) => API.get(`/reviews/product/${productId}`),
};

// Contact API
export const contactAPI = {
  submit: (data) => API.post('/contact', data),
};

// Admin API
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  addProduct: (data) => API.post('/admin/products', data),
  updateProduct: (id, data) => API.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/admin/products/${id}`),
  getAllOrders: () => API.get('/admin/orders'),
  updateOrderStatus: (id, status) => API.put(`/admin/orders/${id}`, { status }),
  getAllReviews: () => API.get('/admin/reviews'),
  deleteReview: (id) => API.delete(`/admin/reviews/${id}`),
  getAllUsers: () => API.get('/admin/users'),
};

export default API;
