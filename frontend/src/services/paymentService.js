import api from './api/index';

class PaymentService {
  async getPaymentMethods() {
    try {
      const response = await api.get('/payments/methods/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async initiatePayment(orderId, method) {
    try {
      const response = await api.post('/payments/initiate/', { orderId, method });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async verifyPayment(paymentId) {
    try {
      const response = await api.post(`/payments/${paymentId}/verify/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentHistory() {
    try {
      const response = await api.get('/payments/history/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentDetails(paymentId) {
    try {
      const response = await api.get(`/payments/${paymentId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async refundPayment(paymentId, reason) {
    try {
      const response = await api.post(`/payments/${paymentId}/refund/`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const paymentService = new PaymentService();
export default paymentService; 