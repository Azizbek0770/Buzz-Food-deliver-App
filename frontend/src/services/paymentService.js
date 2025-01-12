import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: `${API_URL}/payments`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Avtorizatsiya tokenini qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchPaymentStatistics = async () => {
  try {
    const response = await api.get('/statistics/');
    return response.data;
  } catch (error) {
    console.error('Statistika olishda xatolik:', error);
    throw error;
  }
};

export const fetchPaymentHistory = async () => {
  try {
    const response = await api.get('/history/');
    return response.data;
  } catch (error) {
    console.error('To\'lovlar tarixini olishda xatolik:', error);
    throw error;
  }
};

export const createPayment = async (paymentData) => {
  try {
    const response = await api.post('/', paymentData);
    return response.data;
  } catch (error) {
    console.error('To\'lov yaratishda xatolik:', error);
    throw error;
  }
};

export const getPaymentDetails = async (paymentId) => {
  try {
    const response = await api.get(`/${paymentId}/`);
    return response.data;
  } catch (error) {
    console.error('To\'lov ma\'lumotlarini olishda xatolik:', error);
    throw error;
  }
};

// Payme to'lov tizimi uchun metodlar
export const initiatePaymePayment = async (amount, orderId) => {
  try {
    const response = await api.post('/payme/', {
      amount,
      order_id: orderId
    });
    return response.data;
  } catch (error) {
    console.error('Payme to\'lovini boshlashda xatolik:', error);
    throw error;
  }
};

export const checkPaymePayment = async (transactionId) => {
  try {
    const response = await api.get(`/payme/check/${transactionId}/`);
    return response.data;
  } catch (error) {
    console.error('Payme to\'lovini tekshirishda xatolik:', error);
    throw error;
  }
};

// Click to'lov tizimi uchun metodlar
export const initiateClickPayment = async (amount, orderId) => {
  try {
    const response = await api.post('/click/', {
      action: 'prepare',
      amount,
      merchant_trans_id: orderId
    });
    return response.data;
  } catch (error) {
    console.error('Click to\'lovini boshlashda xatolik:', error);
    throw error;
  }
};

export const checkClickPayment = async (clickTransId) => {
  try {
    const response = await api.get(`/click/check/${clickTransId}/`);
    return response.data;
  } catch (error) {
    console.error('Click to\'lovini tekshirishda xatolik:', error);
    throw error;
  }
}; 