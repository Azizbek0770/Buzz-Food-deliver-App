import api from './api';

export const orderAPI = {
  // Yetkazib beruvchi uchun buyurtmalarni olish
  getDeliveryOrders: () => api.get('/orders/delivery/'),

  // Buyurtmani qabul qilish
  acceptOrder: (orderId) => api.post(`/orders/delivery/${orderId}/accept/`),

  // Yetkazishni boshlash
  startDelivery: (orderId) => api.post(`/orders/delivery/${orderId}/start/`),

  // Yetkazishni yakunlash
  completeDelivery: (orderId) => api.post(`/orders/delivery/${orderId}/complete/`),

  // Buyurtma yaratish
  createOrder: (orderData) => api.post('/orders/', orderData),

  // Buyurtmalar ro'yxatini olish
  getOrders: () => api.get('/orders/'),

  // Buyurtma ma'lumotlarini olish
  getOrder: (orderId) => api.get(`/orders/${orderId}/`),
}; 