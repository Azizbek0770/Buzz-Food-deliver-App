import api, { endpoints } from './index';

class PaymentService {
  async getPaymentMethods() {
    try {
      const response = await api.get(endpoints.payments.methods);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async initiatePayment(orderId, method) {
    try {
      const response = await api.post(endpoints.payments.initiate(orderId), { method });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async verifyPayment(orderId, paymentId) {
    try {
      const response = await api.post(endpoints.payments.verify(orderId), { paymentId });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentHistory(params) {
    try {
      const response = await api.get(endpoints.payments.history, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentDetails(paymentId) {
    try {
      const response = await api.get(endpoints.payments.details(paymentId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  async refundPayment(paymentId, reason) {
    try {
      const response = await api.post(endpoints.payments.refund(paymentId), { reason });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Admin uchun metodlar
  async getPaymentStatistics(params) {
    try {
      const response = await api.get(endpoints.payments.statistics, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updatePaymentMethod(methodId, data) {
    try {
      const response = await api.put(endpoints.payments.updateMethod(methodId), data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async togglePaymentMethod(methodId) {
    try {
      const response = await api.post(endpoints.payments.toggleMethod(methodId));
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const paymentService = new PaymentService();
export default paymentService; 