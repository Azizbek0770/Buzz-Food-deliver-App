import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockAuthState } from '../../../utils/test-utils';
import PaymentsPage from '../../../pages/admin/PaymentsPage';
import { server } from '../../../mocks/server';
import { rest } from 'msw';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

describe('PaymentsPage', () => {
  const mockPayments = {
    results: [
      {
        id: 1,
        orderId: 1,
        customer: {
          id: 1,
          name: 'Test User 1'
        },
        amount: 100000,
        method: 'payme',
        status: 'completed',
        createdAt: '2024-01-11T12:00:00Z',
        transactionId: 'test-transaction-1'
      },
      {
        id: 2,
        orderId: 2,
        customer: {
          id: 2,
          name: 'Test User 2'
        },
        amount: 50000,
        method: 'click',
        status: 'pending',
        createdAt: '2024-01-11T11:00:00Z',
        transactionId: 'test-transaction-2'
      }
    ],
    count: 2
  };

  beforeEach(() => {
    server.use(
      rest.get(`${API_URL}/admin/payments/`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockPayments));
      })
    );
  });

  test('renders payments list', async () => {
    render(<PaymentsPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText('Test User 1')).toBeInTheDocument();
    expect(screen.getByText('Test User 2')).toBeInTheDocument();
  });

  test('shows payment details', async () => {
    render(<PaymentsPage />, { preloadedState: mockAuthState });
    
    const viewButton = await screen.findByTestId('view-payment-1');
    fireEvent.click(viewButton);
    
    expect(screen.getByText('test-transaction-1')).toBeInTheDocument();
    expect(screen.getByText('100,000')).toBeInTheDocument();
    expect(screen.getByText(/payme/i)).toBeInTheDocument();
  });

  test('filters payments by status', async () => {
    render(<PaymentsPage />, { preloadedState: mockAuthState });
    
    const statusFilter = screen.getByLabelText(/status/i);
    fireEvent.change(statusFilter, { target: { value: 'completed' } });
    
    await waitFor(() => {
      expect(screen.getByText('Test User 1')).toBeInTheDocument();
      expect(screen.queryByText('Test User 2')).not.toBeInTheDocument();
    });
  });

  test('filters payments by method', async () => {
    render(<PaymentsPage />, { preloadedState: mockAuthState });
    
    const methodFilter = screen.getByLabelText(/to'lov usuli/i);
    fireEvent.change(methodFilter, { target: { value: 'click' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Test User 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test User 2')).toBeInTheDocument();
    });
  });

  test('searches payments', async () => {
    render(<PaymentsPage />, { preloadedState: mockAuthState });
    
    const searchInput = screen.getByPlaceholderText(/qidirish/i);
    fireEvent.change(searchInput, { target: { value: 'Test User 1' } });
    
    await waitFor(() => {
      expect(screen.getByText('Test User 1')).toBeInTheDocument();
      expect(screen.queryByText('Test User 2')).not.toBeInTheDocument();
    });
  });

  test('handles refund request', async () => {
    server.use(
      rest.post(`${API_URL}/admin/payments/1/refund/`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            ...mockPayments.results[0],
            status: 'refunded'
          })
        );
      })
    );

    render(<PaymentsPage />, { preloadedState: mockAuthState });
    
    const refundButton = await screen.findByTestId('refund-payment-1');
    fireEvent.click(refundButton);
    
    // Tasdiqlash dialogini tekshirish
    expect(screen.getByText(/qaytarishni tasdiqlaysizmi/i)).toBeInTheDocument();
    
    // Tasdiqlash
    fireEvent.click(screen.getByRole('button', { name: /tasdiqlash/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/qaytarildi/i)).toBeInTheDocument();
    });
  });

  test('exports payment history', async () => {
    render(<PaymentsPage />, { preloadedState: mockAuthState });
    
    const exportButton = await screen.findByText(/eksport/i);
    fireEvent.click(exportButton);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    const formatSelect = screen.getByLabelText(/format/i);
    fireEvent.change(formatSelect, { target: { value: 'csv' } });
    
    fireEvent.click(screen.getByText(/yuklash/i));
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('shows payment statistics', async () => {
    const mockStats = {
      totalAmount: 1500000,
      successfulPayments: 150,
      failedPayments: 10,
      averageAmount: 75000,
      methodStats: {
        payme: 80,
        click: 70,
        cash: 10
      }
    };

    server.use(
      rest.get(`${API_URL}/admin/payments/stats/`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockStats));
      })
    );

    render(<PaymentsPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText('1,500,000')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('75,000')).toBeInTheDocument();
  });

  test('handles API error', async () => {
    server.use(
      rest.get(`${API_URL}/admin/payments/`, (req, res) => {
        return res.networkError('Failed to connect');
      })
    );

    render(<PaymentsPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText(/ma'lumotlarni yuklashda xatolik/i)).toBeInTheDocument();
  });
}); 