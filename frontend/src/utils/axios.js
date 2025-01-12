import axios from 'axios';
import store from '../store';
import { logout } from '../store/actions/auth';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    const response = await api.post('/users/token/refresh/', {
                        refresh: refreshToken
                    });
                    
                    localStorage.setItem('access_token', response.data.access);
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    store.dispatch(logout());
                    return Promise.reject(refreshError);
                }
            }
        }

        // Xatoliklarni foydalanuvchiga ko'rsatish uchun qayta ishlash
        const errorMessage = error.response?.data?.error || 
                           error.response?.data?.detail || 
                           'Tizimda xatolik yuz berdi';

        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
            details: error.response?.data?.details
        });
    }
);

export default api; 