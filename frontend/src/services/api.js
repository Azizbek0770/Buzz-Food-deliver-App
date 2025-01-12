import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/notificationSlice';
import { checkRateLimit } from '../utils/rateLimit';
import { errorTracker } from '../utils/errorTracking';
import { performanceMonitor } from '../utils/monitoring';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Token yangilash funksiyasi
const refreshAccessToken = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('Refresh token mavjud emas');

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/users/token/refresh/`,
      { refresh }
    );

    localStorage.setItem('token', response.data.access);
    return response.data.access;
  } catch (error) {
    throw error;
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Rate limiting tekshiruvi
    const endpoint = config.url;
    if (!checkRateLimit(endpoint)) {
      return Promise.reject(new Error('Too many requests'));
    }

    // Token qo'shish
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Performance monitoring
    config.metadata = { startTime: Date.now() };

    return config;
  },
  (error) => {
    errorTracker.handleError(error, 'request');
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Performance metrics
    const duration = Date.now() - response.config.metadata.startTime;
    performanceMonitor.recordApiCall(
      response.config.url,
      duration,
      response.status
    );

    return response;
  },
  async (error) => {
    // Performance metrics xatolik uchun
    if (error.config?.metadata) {
      const duration = Date.now() - error.config.metadata.startTime;
      performanceMonitor.recordApiCall(
        error.config.url,
        duration,
        error.response?.status || 0,
        error
      );
    }

    const originalRequest = error.config;

    // Token muddati tugagan
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Token yangilash muvaffaqiyatsiz bo'lsa
        store.dispatch(logout());
        store.dispatch(addNotification({
          type: 'error',
          title: 'Xatolik',
          message: 'Sessiya muddati tugadi. Qaytadan tizimga kiring.'
        }));
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Rate limiting xatoligi
    if (error.message === 'Too many requests') {
      store.dispatch(addNotification({
        type: 'warning',
        title: 'Xatolik',
        message: 'Iltimos biroz kuting va qayta urinib ko\'ring'
      }));
      return Promise.reject(error);
    }

    // Boshqa xatoliklar
    let errorMessage = 'Tizimda xatolik yuz berdi';

    if (error.response) {
      // Backend xatoligi
      if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.status === 404) {
        errorMessage = 'So\'ralgan ma\'lumot topilmadi';
      } else if (error.response.status === 403) {
        errorMessage = 'Sizda bu amalni bajarish uchun huquq yo\'q';
      } else if (error.response.status === 422) {
        errorMessage = 'Kiritilgan ma\'lumotlar noto\'g\'ri';
      }
    } else if (error.request) {
      // Network xatoligi
      errorMessage = 'Server bilan bog\'lanishda xatolik yuz berdi';
    }

    // Xatolikni qayd qilish
    errorTracker.handleApiError(error);

    // Xatolik haqida xabarnoma
    store.dispatch(addNotification({
      type: 'error',
      title: 'Xatolik',
      message: errorMessage
    }));

    return Promise.reject(error);
  }
);

export default api; 