import api, { endpoints } from './index';

class AuthService {
  async login(credentials) {
    try {
      const response = await api.post(endpoints.auth.login, credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
        if (response.refresh_token) {
          localStorage.setItem('refreshToken', response.refresh_token);
        }
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await api.post(endpoints.auth.register, userData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await api.post(endpoints.auth.logout);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      // Xato bo'lsa ham tokenlarni o'chiramiz
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await api.get(endpoints.auth.profile);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(userData) {
    try {
      const response = await api.put(endpoints.auth.profile, userData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      const response = await api.post(endpoints.auth.refresh, {
        refresh_token: refreshToken
      });
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

const authService = new AuthService();
export default authService; 