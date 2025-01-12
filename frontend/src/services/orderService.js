import api from './api/index';

class OrderService {
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders/', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getOrders(params) {
    try {
      const response = await api.get('/orders/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.patch(`/orders/${orderId}/status/`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async cancelOrder(orderId) {
    try {
      const response = await api.post(`/orders/${orderId}/cancel/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const orderService = new OrderService();
export default orderService; 