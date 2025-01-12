import api, { endpoints } from './index';

class RestaurantService {
  async getRestaurants(params) {
    try {
      const response = await api.get(endpoints.restaurants.list, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getRestaurantById(id) {
    try {
      const response = await api.get(endpoints.restaurants.details(id));
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getRestaurantMenu(id) {
    try {
      const response = await api.get(endpoints.restaurants.menu(id));
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getCategories(restaurantId) {
    try {
      const response = await api.get(endpoints.restaurants.categories(restaurantId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  async createCategory(restaurantId, categoryData) {
    try {
      const response = await api.post(endpoints.restaurants.categories(restaurantId), categoryData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(restaurantId, categoryId, categoryData) {
    try {
      const response = await api.put(
        `${endpoints.restaurants.categories(restaurantId)}/${categoryId}`,
        categoryData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(restaurantId, categoryId) {
    try {
      await api.delete(`${endpoints.restaurants.categories(restaurantId)}/${categoryId}`);
    } catch (error) {
      throw error;
    }
  }

  async createProduct(restaurantId, categoryId, productData) {
    try {
      const response = await api.post(
        `${endpoints.restaurants.categories(restaurantId)}/${categoryId}/products`,
        productData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(restaurantId, categoryId, productId, productData) {
    try {
      const response = await api.put(
        `${endpoints.restaurants.categories(restaurantId)}/${categoryId}/products/${productId}`,
        productData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(restaurantId, categoryId, productId) {
    try {
      await api.delete(
        `${endpoints.restaurants.categories(restaurantId)}/${categoryId}/products/${productId}`
      );
    } catch (error) {
      throw error;
    }
  }

  async getReviews(restaurantId, params) {
    try {
      const response = await api.get(endpoints.restaurants.reviews(restaurantId), { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async addReview(restaurantId, reviewData) {
    try {
      const response = await api.post(endpoints.restaurants.reviews(restaurantId), reviewData);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const restaurantService = new RestaurantService();
export default restaurantService; 