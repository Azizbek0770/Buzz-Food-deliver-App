// Auth endpoints
export const AUTH = {
  LOGIN: '/users/token/',
  REGISTER: '/users/register/',
  REFRESH: '/users/token/refresh/',
  PROFILE: '/users/profile/'
};

// User endpoints
export const USER = {
  PROFILE: '/users/me',
  UPDATE_PROFILE: '/users/me',
  UPLOAD_AVATAR: '/users/me/avatar',
  ADDRESSES: '/users/me/addresses'
};

// Restaurant endpoints
export const RESTAURANT = {
  LIST: '/restaurants/',
  DETAIL: (id) => `/restaurants/${id}/`,
  MENU: (id) => `/restaurants/${id}/menu/`,
  REVIEWS: (id) => `/restaurants/${id}/reviews/`
};

// Order endpoints
export const ORDER = {
  CREATE: '/orders/',
  LIST: '/orders/',
  DETAIL: (id) => `/orders/${id}/`,
  CANCEL: (id) => `/orders/${id}/cancel/`,
  UPDATE_STATUS: (id) => `/orders/${id}/status/`
};

// Category endpoints
export const CATEGORY = {
  LIST: '/restaurants/categories/',
  DETAIL: (id) => `/restaurants/categories/${id}/`,
  DISHES: (id) => `/restaurants/categories/${id}/dishes/`
};

// Promotion endpoints
export const PROMOTION = {
  LIST: '/restaurants/promotions/',
  DETAIL: (id) => `/restaurants/promotions/${id}/`,
  CREATE: '/restaurants/promotions/',
  UPDATE: (id) => `/restaurants/promotions/${id}/`,
  DELETE: (id) => `/restaurants/promotions/${id}/`
};

// Payment endpoints
export const PAYMENT = {
  METHODS: '/payments/methods/',
  PROCESS: '/payments/process/',
  VERIFY: '/payments/verify/',
  HISTORY: '/payments/history/'
};

// Statistics endpoints
export const STATISTICS = {
  OVERVIEW: '/restaurants/statistics/overview/',
  SALES: '/restaurants/statistics/sales/',
  POPULAR_DISHES: '/restaurants/statistics/popular-dishes/',
  CUSTOMER_SATISFACTION: '/restaurants/statistics/customer-satisfaction/'
}; 