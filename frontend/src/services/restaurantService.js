import api from './api';

export const restaurantAPI = {
  getRestaurants: (params = {}) => api.get('/restaurants/', { params }),
  getRestaurant: (id) => api.get(`/restaurants/${id}/`),
  getCategories: () => api.get('/restaurants/categories/'),
  getMenu: (restaurantId) => api.get(`/restaurants/${restaurantId}/menu/`),
  addReview: (restaurantId, data) => api.post(`/restaurants/${restaurantId}/reviews/`, data),
  getReviews: (restaurantId) => api.get(`/restaurants/${restaurantId}/reviews/`),
};