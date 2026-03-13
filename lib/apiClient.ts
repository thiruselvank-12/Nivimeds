import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Send httpOnly cookies
  headers: { 'Content-Type': 'application/json' },
});

// Automatic token refresh on 401
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        return apiClient(originalRequest);
      } catch {
        // Refresh failed — user needs to re-login
        window.dispatchEvent(new Event('auth:logout'));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// ==================== Auth ====================
export const authApi = {
  sendOTP: (phone: string, email?: string) =>
    apiClient.post('/api/auth/send-otp', { phone, email }),
  verifyOTP: (phone: string, otp: string, name?: string, email?: string) =>
    apiClient.post('/api/auth/verify-otp', { phone, otp, name, email }),
  refresh: () => apiClient.post('/api/auth/refresh'),
  logout: () => apiClient.post('/api/auth/logout'),
  me: () => apiClient.get('/api/auth/me'),
};

// ==================== Products ====================
export const productsApi = {
  list: (params?: Record<string, string | number | boolean>) =>
    apiClient.get('/api/products', { params }),
  detail: (slug: string) => apiClient.get(`/api/products/${slug}`),
  search: (q: string) => apiClient.get('/api/search', { params: { q } }),
};

// ==================== Cart ====================
export const cartApi = {
  get: () => apiClient.get('/api/cart'),
  sync: (items: any[], couponCode?: string) =>
    apiClient.post('/api/cart', { items, couponCode }),
  update: (data: any) => apiClient.patch('/api/cart', data),
  clear: () => apiClient.delete('/api/cart'),
};

// ==================== Orders ====================
export const ordersApi = {
  list: (page?: number) => apiClient.get('/api/orders', { params: { page } }),
  detail: (orderId: string) => apiClient.get(`/api/orders/${orderId}`),
  create: (data: any) => apiClient.post('/api/orders', data),
};

// ==================== Payments ====================
export const paymentsApi = {
  createOrder: (amount: number) =>
    apiClient.post('/api/payments/create-order', { amount }),
  verify: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => apiClient.post('/api/payments/verify', data),
};

// ==================== Addresses ====================
export const addressesApi = {
  list: () => apiClient.get('/api/addresses'),
  add: (data: any) => apiClient.post('/api/addresses', data),
  delete: (id: string) =>
    apiClient.delete('/api/addresses', { params: { id } }),
};

// ==================== Coupons ====================
export const couponsApi = {
  validate: (code: string, orderTotal?: number) =>
    apiClient.post('/api/coupons', { code, orderTotal }),
};

// ==================== Prescriptions ====================
export const prescriptionsApi = {
  upload: (formData: FormData) =>
    apiClient.post('/api/prescriptions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  list: () => apiClient.get('/api/prescriptions'),
};

// ==================== Admin ====================
export const adminApi = {
  dashboard: () => apiClient.get('/api/admin/dashboard'),
  products: {
    list: (params?: any) => apiClient.get('/api/admin/products', { params }),
    create: (data: any) => apiClient.post('/api/admin/products', data),
    update: (id: string, data: any) =>
      apiClient.patch(`/api/admin/products/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/admin/products/${id}`),
  },
  orders: {
    list: (params?: any) => apiClient.get('/api/admin/orders', { params }),
    updateStatus: (id: string, status: string, note?: string) =>
      apiClient.patch(`/api/admin/orders/${id}`, { status, note }),
  },
  users: {
    list: (params?: any) => apiClient.get('/api/admin/users', { params }),
  },
};
