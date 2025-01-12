import api from './api';
import * as endpoints from './endpoints';

// Auth services
export const authService = {
  async login(credentials) {
    const { data } = await api.post(endpoints.AUTH.LOGIN, credentials);
    localStorage.setItem('token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
  },

  async register(userData) {
    const { data } = await api.post(endpoints.AUTH.REGISTER, userData);
    return data;
  },

  async refreshToken() {
    const refresh = localStorage.getItem('refresh_token');
    const { data } = await api.post(endpoints.AUTH.REFRESH, { refresh });
    localStorage.setItem('token', data.access);
    return data;
  },

  async getProfile() {
    const { data } = await api.get(endpoints.AUTH.PROFILE);
    return data;
  },

  async updateProfile(userData) {
    const { data } = await api.put(endpoints.AUTH.PROFILE, userData);
    return data;
  }
};

// User services
export const userService = {
  async getProfile() {
    const { data } = await api.get(endpoints.USER.PROFILE);
    return data;
  },

  async updateProfile(userData) {
    const { data } = await api.put(endpoints.USER.UPDATE_PROFILE, userData);
    return data;
  },

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await api.post(endpoints.USER.UPLOAD_AVATAR, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }
};

// Restaurant services
export const restaurantService = {
  async getRestaurants(params) {
    const { data } = await api.get(endpoints.RESTAURANT.LIST, { params });
    return data;
  },

  async getRestaurantById(id) {
    const { data } = await api.get(endpoints.RESTAURANT.DETAIL(id));
    return data;
  },

  async getRestaurantMenu(id) {
    const { data } = await api.get(endpoints.RESTAURANT.MENU(id));
    return data;
  },

  async getRestaurantReviews(id) {
    const { data } = await api.get(endpoints.RESTAURANT.REVIEWS(id));
    return data;
  }
};

// Order services
export const orderService = {
  async createOrder(orderData) {
    const { data } = await api.post(endpoints.ORDER.CREATE, orderData);
    return data;
  },

  async getOrders(params) {
    const { data } = await api.get(endpoints.ORDER.LIST, { params });
    return data;
  },

  async getOrderById(id) {
    const { data } = await api.get(endpoints.ORDER.DETAIL(id));
    return data;
  },

  async cancelOrder(id) {
    const { data } = await api.post(endpoints.ORDER.CANCEL(id));
    return data;
  },

  async updateOrderStatus(id, status) {
    const { data } = await api.put(endpoints.ORDER.UPDATE_STATUS(id), { status });
    return data;
  }
};

// Category services
export const categoryService = {
  async getCategories() {
    const { data } = await api.get(endpoints.CATEGORY.LIST);
    return data;
  },

  async getCategoryById(id) {
    const { data } = await api.get(endpoints.CATEGORY.DETAIL(id));
    return data;
  },

  async getCategoryDishes(id) {
    const { data } = await api.get(endpoints.CATEGORY.DISHES(id));
    return data;
  }
};

// Promotion services
export const promotionService = {
  async getPromotions() {
    const { data } = await api.get(endpoints.PROMOTION.LIST);
    return data;
  },

  async getPromotionById(id) {
    const { data } = await api.get(endpoints.PROMOTION.DETAIL(id));
    return data;
  },

  async createPromotion(promotionData) {
    const { data } = await api.post(endpoints.PROMOTION.CREATE, promotionData);
    return data;
  },

  async updatePromotion(id, promotionData) {
    const { data } = await api.put(endpoints.PROMOTION.UPDATE(id), promotionData);
    return data;
  },

  async deletePromotion(id) {
    await api.delete(endpoints.PROMOTION.DELETE(id));
  }
};

// Payment services
export const paymentService = {
  async getPaymentMethods() {
    const { data } = await api.get(endpoints.PAYMENT.METHODS);
    return data;
  },

  async processPayment(paymentData) {
    const { data } = await api.post(endpoints.PAYMENT.PROCESS, paymentData);
    return data;
  },

  async verifyPayment(verificationData) {
    const { data } = await api.post(endpoints.PAYMENT.VERIFY, verificationData);
    return data;
  },

  async getPaymentHistory() {
    const { data } = await api.get(endpoints.PAYMENT.HISTORY);
    return data;
  }
};

// Statistics services
export const statisticsService = {
  async getOverview() {
    const { data } = await api.get(endpoints.STATISTICS.OVERVIEW);
    return data;
  },

  async getSales(params) {
    const { data } = await api.get(endpoints.STATISTICS.SALES, { params });
    return data;
  },

  async getPopularDishes() {
    const { data } = await api.get(endpoints.STATISTICS.POPULAR_DISHES);
    return data;
  },

  async getCustomerSatisfaction() {
    const { data } = await api.get(endpoints.STATISTICS.CUSTOMER_SATISFACTION);
    return data;
  }
}; 