import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const TIMEOUT = 15000; // 15 seconds

export const api = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
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
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const endpoints = {
  auth: {
    login: '/auth/login/',
    register: '/auth/register/',
    refreshToken: '/auth/token/refresh/',
    profile: '/auth/profile/'
  },
  restaurants: {
    list: '/restaurants/',
    detail: (id) => `/restaurants/${id}/`,
    menu: (id) => `/restaurants/${id}/menu/`
  },
  orders: {
    create: '/orders/',
    list: '/orders/',
    detail: (id) => `/orders/${id}/`,
    track: (id) => `/orders/${id}/track/`
  },
  payments: {
    create: '/payments/',
    status: (id) => `/payments/${id}/status/`
  }
};

export default api; 