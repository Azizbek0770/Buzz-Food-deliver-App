import api from './index';

const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  
  // Restaurants
  getRestaurants: (params) => api.get('/admin/restaurants', { params }),
  updateRestaurant: (restaurantId, data) => api.put(`/admin/restaurants/${restaurantId}`, data),
  deleteRestaurant: (restaurantId) => api.delete(`/admin/restaurants/${restaurantId}`),
  
  // Orders
  getOrders: (params) => api.get('/admin/orders', { params }),
  updateOrder: (orderId, data) => api.put(`/admin/orders/${orderId}`, data),
  
  // Payments
  getPayments: (params) => api.get('/admin/payments', { params }),
  refundPayment: (paymentId, reason) => api.post(`/admin/payments/${paymentId}/refund`, { reason }),
  
  // Statistics
  getStatistics: (params) => api.get('/admin/statistics', { params }),
  exportStatistics: (type, params) => api.get(`/admin/statistics/export/${type}`, { 
    params,
    responseType: 'blob'
  })
};

export default adminAPI; 