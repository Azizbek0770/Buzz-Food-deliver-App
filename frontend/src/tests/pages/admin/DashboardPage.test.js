import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockAuthState } from '../../../utils/test-utils';
import DashboardPage from '../../../pages/admin/DashboardPage';
import { server } from '../../../mocks/server';
import { rest } from 'msw';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

describe('DashboardPage', () => {
  const mockStats = {
    totalOrders: 150,
    totalRevenue: 5000000,
    averageOrderValue: 33000,
    customerSatisfaction: 4.5,
    topDishes: [
      { id: 1, name: 'Test Dish 1', orderCount: 50 },
      { id: 2, name: 'Test Dish 2', orderCount: 30 }
    ],
    recentOrders: [
      {
        id: 1,
        customer: 'Test User',
        totalAmount: 100000,
        status: 'pending',
        createdAt: '2024-01-11T12:00:00Z'
      }
    ],
    dailyStats: [
      { date: '2024-01-11', orders: 20, revenue: 600000 }
    ]
  };

  beforeEach(() => {
    server.use(
      rest.get(`${API_URL}/admin/stats/`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockStats));
      })
    );
  });

  test('renders dashboard stats', async () => {
    render(<DashboardPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText('150')).toBeInTheDocument(); // Buyurtmalar soni
    expect(screen.getByText('5,000,000')).toBeInTheDocument(); // Umumiy tushum
    expect(screen.getByText('33,000')).toBeInTheDocument(); // O'rtacha buyurtma
    expect(screen.getByText('4.5')).toBeInTheDocument(); // Mijozlar baholashi
  });

  test('shows top dishes', async () => {
    render(<DashboardPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText('Test Dish 1')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument(); // Buyurtmalar soni
  });

  test('shows recent orders', async () => {
    render(<DashboardPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('100,000')).toBeInTheDocument();
  });

  test('filters stats by date range', async () => {
    server.use(
      rest.get(`${API_URL}/admin/stats/`, (req, res, ctx) => {
        const startDate = req.url.searchParams.get('start_date');
        const endDate = req.url.searchParams.get('end_date');
        
        if (startDate && endDate) {
          return res(
            ctx.status(200),
            ctx.json({
              ...mockStats,
              totalOrders: 50,
              totalRevenue: 1500000
            })
          );
        }
        return res(ctx.status(200), ctx.json(mockStats));
      })
    );

    render(<DashboardPage />, { preloadedState: mockAuthState });
    
    // Sana oralig'ini tanlash
    const dateRangeSelect = screen.getByLabelText(/sana oralig'i/i);
    fireEvent.change(dateRangeSelect, { target: { value: 'week' } });
    
    await waitFor(() => {
      expect(screen.getByText('50')).toBeInTheDocument(); // Yangi buyurtmalar soni
      expect(screen.getByText('1,500,000')).toBeInTheDocument(); // Yangi tushum
    });
  });

  test('shows revenue chart', async () => {
    render(<DashboardPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByTestId('revenue-chart')).toBeInTheDocument();
  });

  test('shows orders chart', async () => {
    render(<DashboardPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByTestId('orders-chart')).toBeInTheDocument();
  });

  test('exports data to CSV', async () => {
    render(<DashboardPage />, { preloadedState: mockAuthState });
    
    const exportButton = await screen.findByText(/eksport/i);
    fireEvent.click(exportButton);
    
    // CSV yuklash dialogini tekshirish
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // CSV formatini tanlash
    const formatSelect = screen.getByLabelText(/format/i);
    fireEvent.change(formatSelect, { target: { value: 'csv' } });
    
    // Yuklashni boshlash
    fireEvent.click(screen.getByText(/yuklash/i));
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    server.use(
      rest.get(`${API_URL}/admin/stats/`, (req, res) => {
        return res.networkError('Failed to connect');
      })
    );

    render(<DashboardPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText(/ma'lumotlarni yuklashda xatolik/i)).toBeInTheDocument();
  });

  test('refreshes data automatically', async () => {
    jest.useFakeTimers();
    
    let requestCount = 0;
    server.use(
      rest.get(`${API_URL}/admin/stats/`, (req, res, ctx) => {
        requestCount++;
        return res(
          ctx.status(200),
          ctx.json({
            ...mockStats,
            totalOrders: 150 + requestCount
          })
        );
      })
    );

    render(<DashboardPage />, { preloadedState: mockAuthState });
    
    // Dastlabki ma'lumotlar
    expect(await screen.findByText('151')).toBeInTheDocument();
    
    // 1 daqiqa o'tkazish
    jest.advanceTimersByTime(60000);
    
    // Yangilangan ma'lumotlar
    await waitFor(() => {
      expect(screen.getByText('152')).toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });
}); 