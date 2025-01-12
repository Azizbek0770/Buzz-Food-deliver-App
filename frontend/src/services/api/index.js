import axios from 'axios';
import { store } from '../../store';
import { logout } from '../../store/slices/authSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Token muddati tugagan bo'lsa
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          store.dispatch(logout());
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken
        });

        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile'
  },
  users: {
    list: '/users',
    details: (id) => `/users/${id}`,
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`
  },
  restaurants: {
    list: '/restaurants',
    details: (id) => `/restaurants/${id}`,
    menu: (id) => `/restaurants/${id}/menu`,
    categories: (id) => `/restaurants/${id}/categories`,
    reviews: (id) => `/restaurants/${id}/reviews`
  },
  orders: {
    create: '/orders',
    list: '/orders',
    details: (id) => `/orders/${id}`,
    update: (id) => `/orders/${id}`,
    cancel: (id) => `/orders/${id}/cancel`
  },
  payments: {
    methods: '/payments/methods',
    process: '/payments/process',
    verify: '/payments/verify',
    history: '/payments/history'
  },
  delivery: {
    available: '/delivery/available',
    assign: (id) => `/delivery/${id}/assign`,
    complete: (id) => `/delivery/${id}/complete`
  },
  statistics: {
    overview: '/statistics/overview',
    sales: '/statistics/sales',
    orders: '/statistics/orders',
    customers: '/statistics/customers'
  }
};

export default api; 