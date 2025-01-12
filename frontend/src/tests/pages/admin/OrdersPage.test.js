import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockAuthState, mockWebSocketEvent } from '../../../utils/test-utils';
import OrdersPage from '../../../pages/admin/OrdersPage';
import { server } from '../../../mocks/server';
import { rest } from 'msw';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

describe('OrdersPage', () => {
  const mockOrders = {
    results: [
      {
        id: 1,
        customer: {
          id: 1,
          name: 'Test User 1',
          phone: '+998901234567'
        },
        restaurant: {
          id: 1,
          name: 'Test Restaurant'
        },
        items: [
          {
            id: 1,
            name: 'Test Dish',
            quantity: 2,
            price: 50000
          }
        ],
        totalAmount: 100000,
        status: 'pending',
        createdAt: '2024-01-11T12:00:00Z',
        deliveryAddress: 'Test Address 1'
      },
      {
        id: 2,
        customer: {
          id: 2,
          name: 'Test User 2',
          phone: '+998907654321'
        },
        restaurant: {
          id: 1,
          name: 'Test Restaurant'
        },
        items: [
          {
            id: 2,
            name: 'Test Dish 2',
            quantity: 1,
            price: 35000
          }
        ],
        totalAmount: 35000,
        status: 'delivered',
        createdAt: '2024-01-11T11:00:00Z',
        deliveryAddress: 'Test Address 2'
      }
    ],
    count: 2
  };

  beforeEach(() => {
    server.use(
      rest.get(`${API_URL}/admin/orders/`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockOrders));
      })
    );
  });

  test('renders orders list', async () => {
    render(<OrdersPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText('Test User 1')).toBeInTheDocument();
    expect(screen.getByText('Test User 2')).toBeInTheDocument();
  });

  test('shows order details', async () => {
    render(<OrdersPage />, { preloadedState: mockAuthState });
    
    // Birinchi buyurtmani tanlash
    const viewButton = await screen.findByTestId('view-order-1');
    fireEvent.click(viewButton);
    
    // Ma'lumotlarni tekshirish
    expect(screen.getByText('Test Dish')).toBeInTheDocument();
    expect(screen.getByText('100,000')).toBeInTheDocument();
    expect(screen.getByText('Test Address 1')).toBeInTheDocument();
  });

  test('updates order status', async () => {
    server.use(
      rest.patch(`${API_URL}/admin/orders/1/status/`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            ...mockOrders.results[0],
            status: 'confirmed'
          })
        );
      })
    );

    render(<OrdersPage />, { preloadedState: mockAuthState });
    
    // Status o'zgartirish
    const statusSelect = await screen.findByTestId('status-select-1');
    fireEvent.change(statusSelect, { target: { value: 'confirmed' } });
    
    // Tasdiqlash
    fireEvent.click(screen.getByRole('button', { name: /tasdiqlash/i }));
    
    // Status o'zgarganini tekshirish
    await waitFor(() => {
      expect(screen.getByText(/tasdiqlangan/i)).toBeInTheDocument();
    });
  });

  test('assigns delivery person', async () => {
    server.use(
      rest.patch(`${API_URL}/admin/orders/1/assign/`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            ...mockOrders.results[0],
            deliveryPerson: {
              id: 1,
              name: 'Test Driver'
            }
          })
        );
      })
    );

    render(<OrdersPage />, { preloadedState: mockAuthState });
    
    // Yetkazib beruvchini tanlash
    const assignButton = await screen.findByTestId('assign-order-1');
    fireEvent.click(assignButton);
    
    // Haydovchini tanlash
    const driverSelect = screen.getByLabelText(/haydovchi/i);
    fireEvent.change(driverSelect, { target: { value: '1' } });
    
    // Tasdiqlash
    fireEvent.click(screen.getByRole('button', { name: /tasdiqlash/i }));
    
    // Haydovchi tayinlanganini tekshirish
    await waitFor(() => {
      expect(screen.getByText('Test Driver')).toBeInTheDocument();
    });
  });

  test('filters orders by status', async () => {
    render(<OrdersPage />, { preloadedState: mockAuthState });
    
    // Status bo'yicha filtrlash
    const statusFilter = screen.getByLabelText(/status/i);
    fireEvent.change(statusFilter, { target: { value: 'delivered' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Test User 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test User 2')).toBeInTheDocument();
    });
  });

  test('searches orders', async () => {
    render(<OrdersPage />, { preloadedState: mockAuthState });
    
    // Qidiruv
    const searchInput = screen.getByPlaceholderText(/qidirish/i);
    fireEvent.change(searchInput, { target: { value: 'Test User 1' } });
    
    await waitFor(() => {
      expect(screen.getByText('Test User 1')).toBeInTheDocument();
      expect(screen.queryByText('Test User 2')).not.toBeInTheDocument();
    });
  });

  test('handles new order notification', async () => {
    render(<OrdersPage />, { preloadedState: mockAuthState });
    
    // Yangi buyurtma kelishi
    const newOrder = {
      id: 3,
      customer: {
        id: 3,
        name: 'Test User 3',
        phone: '+998903456789'
      },
      restaurant: {
        id: 1,
        name: 'Test Restaurant'
      },
      items: [
        {
          id: 3,
          name: 'Test Dish 3',
          quantity: 1,
          price: 45000
        }
      ],
      totalAmount: 45000,
      status: 'pending',
      createdAt: new Date().toISOString(),
      deliveryAddress: 'Test Address 3'
    };
    
    const wsEvent = mockWebSocketEvent('NEW_ORDER', newOrder);
    window.dispatchEvent(wsEvent);
    
    // Yangi buyurtma ko'rsatilganini tekshirish
    expect(await screen.findByText('Test User 3')).toBeInTheDocument();
    
    // Bildirishnoma tovushi chalinganini tekshirish
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  test('handles order status update notification', async () => {
    render(<OrdersPage />, { preloadedState: mockAuthState });
    
    // Status o'zgarishi haqida xabar
    const statusUpdate = {
      orderId: 1,
      status: 'preparing',
      updatedAt: new Date().toISOString()
    };
    
    const wsEvent = mockWebSocketEvent('ORDER_STATUS_UPDATED', statusUpdate);
    window.dispatchEvent(wsEvent);
    
    // Status o'zgarganini tekshirish
    await waitFor(() => {
      expect(screen.getByText(/tayyorlanmoqda/i)).toBeInTheDocument();
    });
  });

  test('exports orders to CSV', async () => {
    render(<OrdersPage />, { preloadedState: mockAuthState });
    
    // Eksport qilish tugmasini bosish
    const exportButton = await screen.findByText(/eksport/i);
    fireEvent.click(exportButton);
    
    // CSV yuklash dialogini tekshirish
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Formatni tanlash
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
      rest.get(`${API_URL}/admin/orders/`, (req, res) => {
        return res.networkError('Failed to connect');
      })
    );

    render(<OrdersPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText(/ma'lumotlarni yuklashda xatolik/i)).toBeInTheDocument();
  });
}); 