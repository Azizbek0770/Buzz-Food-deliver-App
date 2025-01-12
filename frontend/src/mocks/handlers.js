import { rest } from 'msw';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export const handlers = [
  // Auth handlers
  rest.post(`${API_URL}/auth/login/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        user: {
          id: 1,
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          role: 'customer'
        }
      })
    );
  }),

  // Users handlers
  rest.get(`${API_URL}/admin/users/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        results: [
          {
            id: 1,
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            role: 'customer'
          }
        ],
        count: 1
      })
    );
  }),

  // Restaurants handlers
  rest.get(`${API_URL}/restaurants/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        results: [
          {
            id: 1,
            name: 'Test Restaurant',
            description: 'Test Description',
            rating: 4.5,
            address: 'Test Address'
          }
        ],
        count: 1
      })
    );
  }),

  // Orders handlers
  rest.get(`${API_URL}/orders/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        results: [
          {
            id: 1,
            status: 'pending',
            total: 100000,
            items: []
          }
        ],
        count: 1
      })
    );
  }),

  // Statistics handlers
  rest.get(`${API_URL}/admin/statistics/overview/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        totalOrders: 100,
        totalRevenue: 10000000,
        averageOrderValue: 100000,
        customerSatisfaction: 4.5
      })
    );
  }),

  // Payment handlers
  rest.post(`${API_URL}/payments/process/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        status: 'success',
        amount: 100000
      })
    );
  })
]; 