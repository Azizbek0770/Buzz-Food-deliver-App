import api, { endpoints } from './index';

class AdminService {
  // Statistika
  async getDashboardStats(params) {
    try {
      const response = await api.get('/admin/dashboard/stats', { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Foydalanuvchilar
  async getUsers(params) {
    try {
      const response = await api.get('/admin/users', { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      await api.delete(`/admin/users/${userId}`);
    } catch (error) {
      throw error;
    }
  }

  // Restoranlar
  async getRestaurants(params) {
    try {
      const response = await api.get('/admin/restaurants', { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateRestaurant(restaurantId, restaurantData) {
    try {
      const response = await api.put(`/admin/restaurants/${restaurantId}`, restaurantData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteRestaurant(restaurantId) {
    try {
      await api.delete(`/admin/restaurants/${restaurantId}`);
    } catch (error) {
      throw error;
    }
  }

  // Buyurtmalar
  async getOrders(params) {
    try {
      const response = await api.get('/admin/orders', { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateOrder(orderId, orderData) {
    try {
      const response = await api.put(`/admin/orders/${orderId}`, orderData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // To'lovlar
  async getPayments(params) {
    try {
      const response = await api.get('/admin/payments', { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async refundPayment(paymentId, reason) {
    try {
      const response = await api.post(`/admin/payments/${paymentId}/refund`, { reason });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Yetkazib beruvchilar
  async getDeliveryPersonnel(params) {
    try {
      const response = await api.get('/admin/delivery-personnel', { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateDeliveryPerson(personnelId, data) {
    try {
      const response = await api.put(`/admin/delivery-personnel/${personnelId}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const adminService = new AdminService();
export default adminService; 