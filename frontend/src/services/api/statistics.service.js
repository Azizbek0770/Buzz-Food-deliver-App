import api, { endpoints } from './index';

class StatisticsService {
  async getOverview(params) {
    try {
      const response = await api.get(endpoints.statistics.overview, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getSalesStatistics(params) {
    try {
      const response = await api.get(endpoints.statistics.sales, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getPopularDishes(params) {
    try {
      const response = await api.get(endpoints.statistics.popularDishes, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getCustomerSatisfaction(params) {
    try {
      const response = await api.get(endpoints.statistics.customerSatisfaction, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getRestaurantStatistics(restaurantId, params) {
    try {
      const response = await api.get(endpoints.statistics.restaurant(restaurantId), { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getDeliveryStatistics(params) {
    try {
      const response = await api.get(endpoints.statistics.delivery, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentStatistics(params) {
    try {
      const response = await api.get(endpoints.statistics.payments, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async exportStatistics(type, params) {
    try {
      const response = await api.get(endpoints.statistics.export(type), { 
        params,
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const statisticsService = new StatisticsService();
export default statisticsService; 