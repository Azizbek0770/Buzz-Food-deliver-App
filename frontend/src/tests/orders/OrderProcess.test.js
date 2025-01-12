import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockAuthState } from '../../utils/test-utils';
import OrderProcess from '../../components/orders/OrderProcess';
import { server } from '../../mocks/server';
import { rest } from 'msw';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

describe('OrderProcess Component', () => {
  const mockOrder = {
    items: [
      { id: 1, name: 'Test Dish 1', price: 50000, quantity: 2 },
      { id: 2, name: 'Test Dish 2', price: 35000, quantity: 1 }
    ],
    restaurantId: 1,
    totalAmount: 135000
  };

  beforeEach(() => {
    localStorage.setItem('cart', JSON.stringify(mockOrder));
  });

  test('renders order summary correctly', () => {
    render(<OrderProcess />, { preloadedState: mockAuthState });
    
    expect(screen.getByText('Test Dish 1')).toBeInTheDocument();
    expect(screen.getByText('Test Dish 2')).toBeInTheDocument();
    expect(screen.getByText('135,000')).toBeInTheDocument();
  });

  test('validates delivery address', async () => {
    render(<OrderProcess />, { preloadedState: mockAuthState });
    
    const submitButton = screen.getByRole('button', { name: /buyurtma berish/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/manzil kiritish shart/i)).toBeInTheDocument();
  });

  test('handles successful order creation', async () => {
    const { store } = render(<OrderProcess />, { preloadedState: mockAuthState });
    
    // Manzil kiritish
    fireEvent.change(screen.getByLabelText(/manzil/i), {
      target: { value: 'Test Address 123' }
    });
    
    // To'lov usulini tanlash
    fireEvent.change(screen.getByLabelText(/to'lov usuli/i), {
      target: { value: 'cash' }
    });
    
    // Buyurtma berish
    fireEvent.click(screen.getByRole('button', { name: /buyurtma berish/i }));

    await waitFor(() => {
      const state = store.getState();
      expect(state.orders.currentOrder).toBeTruthy();
      expect(state.cart.items).toHaveLength(0);
    });

    expect(screen.getByText(/buyurtma muvaffaqiyatli yaratildi/i)).toBeInTheDocument();
  });

  test('handles payment processing', async () => {
    render(<OrderProcess />, { preloadedState: mockAuthState });
    
    // Manzil kiritish
    fireEvent.change(screen.getByLabelText(/manzil/i), {
      target: { value: 'Test Address 123' }
    });
    
    // Online to'lovni tanlash
    fireEvent.change(screen.getByLabelText(/to'lov usuli/i), {
      target: { value: 'card' }
    });
    
    // To'lov ma'lumotlarini kiritish
    fireEvent.change(screen.getByLabelText(/karta raqami/i), {
      target: { value: '8600123456789012' }
    });
    
    // Buyurtma berish
    fireEvent.click(screen.getByRole('button', { name: /buyurtma berish/i }));

    expect(await screen.findByText(/to'lov amalga oshirilmoqda/i)).toBeInTheDocument();
    expect(await screen.findByText(/to'lov muvaffaqiyatli yakunlandi/i)).toBeInTheDocument();
  });

  test('handles payment failure', async () => {
    server.use(
      rest.post(`${API_URL}/payments/process/`, (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            message: 'To\'lov amalga oshmadi'
          })
        );
      })
    );

    render(<OrderProcess />, { preloadedState: mockAuthState });
    
    // Manzil kiritish
    fireEvent.change(screen.getByLabelText(/manzil/i), {
      target: { value: 'Test Address 123' }
    });
    
    // Online to'lovni tanlash
    fireEvent.change(screen.getByLabelText(/to'lov usuli/i), {
      target: { value: 'card' }
    });
    
    // To'lov ma'lumotlarini kiritish
    fireEvent.change(screen.getByLabelText(/karta raqami/i), {
      target: { value: '8600123456789012' }
    });
    
    // Buyurtma berish
    fireEvent.click(screen.getByRole('button', { name: /buyurtma berish/i }));

    expect(await screen.findByText(/to'lov amalga oshmadi/i)).toBeInTheDocument();
  });

  test('shows order tracking after successful order', async () => {
    render(<OrderProcess />, { preloadedState: mockAuthState });
    
    // Manzil kiritish
    fireEvent.change(screen.getByLabelText(/manzil/i), {
      target: { value: 'Test Address 123' }
    });
    
    // To'lov usulini tanlash
    fireEvent.change(screen.getByLabelText(/to'lov usuli/i), {
      target: { value: 'cash' }
    });
    
    // Buyurtma berish
    fireEvent.click(screen.getByRole('button', { name: /buyurtma berish/i }));

    // Buyurtma kuzatish komponenti ko'rsatilganini tekshirish
    expect(await screen.findByTestId('order-tracker')).toBeInTheDocument();
    expect(screen.getByText(/buyurtma qabul qilindi/i)).toBeInTheDocument();
  });
}); 