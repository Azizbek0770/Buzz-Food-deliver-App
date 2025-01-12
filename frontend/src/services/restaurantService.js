import api from './api/index';

class RestaurantService {
  async getRestaurants(params) {
    try {
      const response = await api.get('/restaurants/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getRestaurantById(restaurantId) {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getRestaurantMenu(restaurantId) {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/menu/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCategories(restaurantId) {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/categories/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createCategory(restaurantId, categoryData) {
    try {
      const response = await api.post(`/restaurants/${restaurantId}/categories/`, categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(restaurantId, categoryId, categoryData) {
    try {
      const response = await api.patch(`/restaurants/${restaurantId}/categories/${categoryId}/`, categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(restaurantId, categoryId) {
    try {
      await api.delete(`/restaurants/${restaurantId}/categories/${categoryId}/`);
    } catch (error) {
      throw error;
    }
  }

  async createProduct(restaurantId, productData) {
    try {
      const response = await api.post(`/restaurants/${restaurantId}/products/`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(restaurantId, productId, productData) {
    try {
      const response = await api.patch(`/restaurants/${restaurantId}/products/${productId}/`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(restaurantId, productId) {
    try {
      await api.delete(`/restaurants/${restaurantId}/products/${productId}/`);
    } catch (error) {
      throw error;
    }
  }
}

const restaurantService = new RestaurantService();
export default restaurantService;