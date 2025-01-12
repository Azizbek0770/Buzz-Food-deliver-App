import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockAuthState, mockUser } from '../../utils/test-utils';
import ProfilePage from '../../pages/ProfilePage';
import { server } from '../../mocks/server';
import { rest } from 'msw';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

describe('ProfilePage', () => {
  beforeEach(() => {
    server.use(
      rest.get(`${API_URL}/users/profile/`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockUser));
      })
    );
  });

  test('renders profile information', async () => {
    render(<ProfilePage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText(mockUser.firstName)).toBeInTheDocument();
    expect(screen.getByText(mockUser.lastName)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText(mockUser.phone)).toBeInTheDocument();
  });

  test('allows editing profile information', async () => {
    render(<ProfilePage />, { preloadedState: mockAuthState });
    
    // Edit tugmasini bosish
    fireEvent.click(await screen.findByText(/tahrirlash/i));
    
    // Ismni o'zgartirish
    const firstNameInput = screen.getByLabelText(/ism/i);
    fireEvent.change(firstNameInput, { target: { value: 'Yangi Ism' } });
    
    // Saqlash
    fireEvent.click(screen.getByRole('button', { name: /saqlash/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Yangi Ism')).toBeInTheDocument();
    });
  });

  test('shows order history', async () => {
    server.use(
      rest.get(`${API_URL}/orders/`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            results: [
              {
                id: 1,
                items: [{ name: 'Test Dish', quantity: 2 }],
                totalAmount: 100000,
                status: 'delivered',
                createdAt: '2024-01-11T12:00:00Z'
              }
            ]
          })
        );
      })
    );

    render(<ProfilePage />, { preloadedState: mockAuthState });
    
    // Buyurtmalar tabini tanlash
    fireEvent.click(await screen.findByText(/buyurtmalar/i));
    
    expect(await screen.findByText('Test Dish')).toBeInTheDocument();
    expect(screen.getByText('100,000')).toBeInTheDocument();
  });

  test('shows saved addresses', async () => {
    server.use(
      rest.get(`${API_URL}/users/addresses/`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([
            {
              id: 1,
              title: 'Uy',
              address: 'Test Address 1',
              isDefault: true
            }
          ])
        );
      })
    );

    render(<ProfilePage />, { preloadedState: mockAuthState });
    
    // Manzillar tabini tanlash
    fireEvent.click(await screen.findByText(/manzillar/i));
    
    expect(await screen.findByText('Uy')).toBeInTheDocument();
    expect(screen.getByText('Test Address 1')).toBeInTheDocument();
  });

  test('adds new address', async () => {
    render(<ProfilePage />, { preloadedState: mockAuthState });
    
    // Manzillar tabini tanlash
    fireEvent.click(await screen.findByText(/manzillar/i));
    
    // Yangi manzil qo'shish
    fireEvent.click(screen.getByText(/yangi manzil/i));
    
    // Forma to'ldirish
    fireEvent.change(screen.getByLabelText(/sarlavha/i), {
      target: { value: 'Ofis' }
    });
    fireEvent.change(screen.getByLabelText(/manzil/i), {
      target: { value: 'Test Address 2' }
    });
    
    // Saqlash
    fireEvent.click(screen.getByRole('button', { name: /saqlash/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Ofis')).toBeInTheDocument();
      expect(screen.getByText('Test Address 2')).toBeInTheDocument();
    });
  });

  test('shows payment methods', async () => {
    server.use(
      rest.get(`${API_URL}/users/payment-methods/`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([
            {
              id: 1,
              type: 'card',
              cardNumber: '**** **** **** 1234',
              isDefault: true
            }
          ])
        );
      })
    );

    render(<ProfilePage />, { preloadedState: mockAuthState });
    
    // To'lov usullari tabini tanlash
    fireEvent.click(await screen.findByText(/to'lov usullari/i));
    
    expect(await screen.findByText(/1234/)).toBeInTheDocument();
  });

  test('shows notifications settings', async () => {
    render(<ProfilePage />, { preloadedState: mockAuthState });
    
    // Sozlamalar tabini tanlash
    fireEvent.click(await screen.findByText(/sozlamalar/i));
    
    expect(screen.getByText(/bildirishnomalar/i)).toBeInTheDocument();
    
    // Bildirishnomani o'zgartirish
    const toggle = screen.getByRole('switch', { name: /yangi buyurtmalar/i });
    fireEvent.click(toggle);
    
    await waitFor(() => {
      expect(toggle).toBeChecked();
    });
  });

  test('handles profile update error', async () => {
    server.use(
      rest.put(`${API_URL}/users/profile/`, (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            message: 'Xatolik yuz berdi'
          })
        );
      })
    );

    render(<ProfilePage />, { preloadedState: mockAuthState });
    
    // Edit tugmasini bosish
    fireEvent.click(await screen.findByText(/tahrirlash/i));
    
    // Ismni o'zgartirish
    const firstNameInput = screen.getByLabelText(/ism/i);
    fireEvent.change(firstNameInput, { target: { value: 'Yangi Ism' } });
    
    // Saqlash
    fireEvent.click(screen.getByRole('button', { name: /saqlash/i }));
    
    expect(await screen.findByText(/xatolik yuz berdi/i)).toBeInTheDocument();
  });
}); 