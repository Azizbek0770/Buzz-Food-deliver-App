import api, { endpoints } from './index';

class OrderService {
  async createOrder(orderData) {
    try {
      const response = await api.post(endpoints.orders.create, orderData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getOrders(params) {
    try {
      const response = await api.get(endpoints.orders.list, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getOrderById(id) {
    try {
      const response = await api.get(endpoints.orders.details(id));
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateOrderStatus(id, status) {
    try {
      const response = await api.put(endpoints.orders.update(id), { status });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async cancelOrder(id, reason) {
    try {
      const response = await api.post(endpoints.orders.cancel(id), { reason });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Yetkazib beruvchi uchun metodlar
  async getAvailableOrders() {
    try {
      const response = await api.get(endpoints.delivery.available);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async assignOrder(orderId) {
    try {
      const response = await api.post(endpoints.delivery.assign(orderId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  async completeDelivery(orderId, deliveryData) {
    try {
      const response = await api.post(endpoints.delivery.complete(orderId), deliveryData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Restaurant uchun metodlar
  async getRestaurantOrders(restaurantId, params) {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/orders`, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async acceptOrder(orderId) {
    try {
      const response = await api.post(`/orders/${orderId}/accept`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async rejectOrder(orderId, reason) {
    try {
      const response = await api.post(`/orders/${orderId}/reject`, { reason });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async setOrderReady(orderId) {
    try {
      const response = await api.post(`/orders/${orderId}/ready`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const orderService = new OrderService();
export default orderService; 