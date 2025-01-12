import axios from 'axios';
import { authAPI, restaurantAPI, orderAPI } from '../api';

jest.mock('axios');

describe('API Services', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Auth API', () => {
    it('should login successfully', async () => {
      const mockResponse = { data: { token: 'test-token', user: { id: 1 } } };
      axios.create.mockReturnValue({ post: jest.fn().mockResolvedValue(mockResponse) });

      const credentials = { username: 'test', password: 'password' };
      const response = await authAPI.login(credentials);

      expect(response).toEqual(mockResponse);
    });

    it('should handle login error', async () => {
      const mockError = { response: { data: { message: 'Invalid credentials' } } };
      axios.create.mockReturnValue({ post: jest.fn().mockRejectedValue(mockError) });

      const credentials = { username: 'test', password: 'wrong' };
      await expect(authAPI.login(credentials)).rejects.toEqual(mockError);
    });
  });

  describe('Restaurant API', () => {
    it('should get all restaurants', async () => {
      const mockResponse = { data: [{ id: 1, name: 'Test Restaurant' }] };
      axios.create.mockReturnValue({ get: jest.fn().mockResolvedValue(mockResponse) });

      const response = await restaurantAPI.getAll();
      expect(response).toEqual(mockResponse);
    });
  });

  describe('Order API', () => {
    it('should create order successfully', async () => {
      const mockResponse = { data: { id: 1, status: 'pending' } };
      axios.create.mockReturnValue({ post: jest.fn().mockResolvedValue(mockResponse) });

      const orderData = { restaurant_id: 1, items: [] };
      const response = await orderAPI.create(orderData);
      expect(response).toEqual(mockResponse);
    });
  });
}); 