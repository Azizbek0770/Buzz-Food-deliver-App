import api from './api/index';

class ReviewService {
  async getReviews(restaurantId) {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/reviews`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addReview(restaurantId, reviewData) {
    try {
      const response = await api.post(`/restaurants/${restaurantId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateReview(restaurantId, reviewId, reviewData) {
    try {
      const response = await api.put(`/restaurants/${restaurantId}/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteReview(restaurantId, reviewId) {
    try {
      await api.delete(`/restaurants/${restaurantId}/reviews/${reviewId}`);
    } catch (error) {
      throw error;
    }
  }
}

export default new ReviewService(); 