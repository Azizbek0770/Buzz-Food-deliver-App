import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockAuthState } from '../../../utils/test-utils';
import StatisticsPage from '../../../pages/admin/StatisticsPage';
import { server } from '../../../mocks/server';
import { rest } from 'msw';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

describe('StatisticsPage', () => {
  const mockStats = {
    overview: {
      totalRevenue: 15000000,
      totalOrders: 500,
      averageOrderValue: 30000,
      customerSatisfaction: 4.5
    },
    salesByPeriod: [
      { date: '2024-01-11', orders: 50, revenue: 1500000 },
      { date: '2024-01-10', orders: 45, revenue: 1350000 }
    ],
    topDishes: [
      { id: 1, name: 'Test Dish 1', orderCount: 100, revenue: 3000000 },
      { id: 2, name: 'Test Dish 2', orderCount: 80, revenue: 2400000 }
    ],
    customerStats: {
      newCustomers: 50,
      returningCustomers: 150,
      totalCustomers: 200
    },
    restaurantStats: [
      { id: 1, name: 'Test Restaurant 1', orders: 200, revenue: 6000000 },
      { id: 2, name: 'Test Restaurant 2', orders: 150, revenue: 4500000 }
    ]
  };

  beforeEach(() => {
    server.use(
      rest.get(`${API_URL}/admin/statistics/`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockStats));
      })
    );
  });

  test('renders overview statistics', async () => {
    render(<StatisticsPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText('15,000,000')).toBeInTheDocument(); // Umumiy tushum
    expect(screen.getByText('500')).toBeInTheDocument(); // Buyurtmalar soni
    expect(screen.getByText('30,000')).toBeInTheDocument(); // O'rtacha buyurtma
    expect(screen.getByText('4.5')).toBeInTheDocument(); // Mijozlar baholashi
  });

  test('shows sales chart', async () => {
    render(<StatisticsPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByTestId('sales-chart')).toBeInTheDocument();
  });

  test('filters statistics by date range', async () => {
    server.use(
      rest.get(`${API_URL}/admin/statistics/`, (req, res, ctx) => {
        const startDate = req.url.searchParams.get('start_date');
        const endDate = req.url.searchParams.get('end_date');
        
        if (startDate && endDate) {
          return res(
            ctx.status(200),
            ctx.json({
              ...mockStats,
              overview: {
                ...mockStats.overview,
                totalRevenue: 5000000,
                totalOrders: 200
              }
            })
          );
        }
        return res(ctx.status(200), ctx.json(mockStats));
      })
    );

    render(<StatisticsPage />, { preloadedState: mockAuthState });
    
    // Sana oralig'ini tanlash
    const dateRangeSelect = screen.getByLabelText(/sana oralig'i/i);
    fireEvent.change(dateRangeSelect, { target: { value: 'week' } });
    
    await waitFor(() => {
      expect(screen.getByText('5,000,000')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
    });
  });

  test('shows top dishes', async () => {
    render(<StatisticsPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText('Test Dish 1')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument(); // Buyurtmalar soni
    expect(screen.getByText('3,000,000')).toBeInTheDocument(); // Tushum
  });

  test('shows customer statistics', async () => {
    render(<StatisticsPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText('50')).toBeInTheDocument(); // Yangi mijozlar
    expect(screen.getByText('150')).toBeInTheDocument(); // Doimiy mijozlar
    expect(screen.getByText('200')).toBeInTheDocument(); // Jami mijozlar
  });

  test('shows restaurant statistics', async () => {
    render(<StatisticsPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText('Test Restaurant 1')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument(); // Buyurtmalar soni
    expect(screen.getByText('6,000,000')).toBeInTheDocument(); // Tushum
  });

  test('exports statistics to CSV', async () => {
    render(<StatisticsPage />, { preloadedState: mockAuthState });
    
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

  test('shows comparison with previous period', async () => {
    render(<StatisticsPage />, { preloadedState: mockAuthState });
    
    const comparisonButton = await screen.findByText(/taqqoslash/i);
    fireEvent.click(comparisonButton);
    
    expect(screen.getByTestId('comparison-chart')).toBeInTheDocument();
  });

  test('handles API error', async () => {
    server.use(
      rest.get(`${API_URL}/admin/statistics/`, (req, res) => {
        return res.networkError('Failed to connect');
      })
    );

    render(<StatisticsPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText(/ma'lumotlarni yuklashda xatolik/i)).toBeInTheDocument();
  });

  test('updates statistics automatically', async () => {
    jest.useFakeTimers();
    
    let requestCount = 0;
    server.use(
      rest.get(`${API_URL}/admin/statistics/`, (req, res, ctx) => {
        requestCount++;
        return res(
          ctx.status(200),
          ctx.json({
            ...mockStats,
            overview: {
              ...mockStats.overview,
              totalOrders: 500 + requestCount
            }
          })
        );
      })
    );

    render(<StatisticsPage />, { preloadedState: mockAuthState });
    
    // Dastlabki ma'lumotlar
    expect(await screen.findByText('501')).toBeInTheDocument();
    
    // 1 daqiqa o'tkazish
    jest.advanceTimersByTime(60000);
    
    // Yangilangan ma'lumotlar
    await waitFor(() => {
      expect(screen.getByText('502')).toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });
}); 