import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockAuthState } from '../../../utils/test-utils';
import RestaurantsPage from '../../../pages/admin/RestaurantsPage';
import { server } from '../../../mocks/server';
import { rest } from 'msw';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

describe('RestaurantsPage', () => {
  const mockRestaurants = {
    results: [
      {
        id: 1,
        name: 'Test Restaurant 1',
        description: 'Test Description 1',
        address: 'Test Address 1',
        phone: '+998901234567',
        rating: 4.5,
        isActive: true
      },
      {
        id: 2,
        name: 'Test Restaurant 2',
        description: 'Test Description 2',
        address: 'Test Address 2',
        phone: '+998907654321',
        rating: 4.0,
        isActive: false
      }
    ],
    count: 2
  };

  beforeEach(() => {
    server.use(
      rest.get(`${API_URL}/admin/restaurants/`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockRestaurants));
      })
    );
  });

  test('renders restaurants list', async () => {
    render(<RestaurantsPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText('Test Restaurant 1')).toBeInTheDocument();
    expect(screen.getByText('Test Restaurant 2')).toBeInTheDocument();
  });

  test('shows restaurant details', async () => {
    render(<RestaurantsPage />, { preloadedState: mockAuthState });
    
    // Birinchi restoranni tanlash
    const viewButton = await screen.findByTestId('view-restaurant-1');
    fireEvent.click(viewButton);
    
    // Ma'lumotlarni tekshirish
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Address 1')).toBeInTheDocument();
    expect(screen.getByText('+998901234567')).toBeInTheDocument();
  });

  test('adds new restaurant', async () => {
    server.use(
      rest.post(`${API_URL}/admin/restaurants/`, (req, res, ctx) => {
        return res(
          ctx.status(201),
          ctx.json({
            id: 3,
            name: 'New Restaurant',
            description: 'New Description',
            address: 'New Address',
            phone: '+998909876543',
            rating: 0,
            isActive: true
          })
        );
      })
    );

    render(<RestaurantsPage />, { preloadedState: mockAuthState });
    
    // Yangi restoran qo'shish tugmasi
    fireEvent.click(screen.getByText(/yangi restoran/i));
    
    // Forma to'ldirish
    fireEvent.change(screen.getByLabelText(/nomi/i), {
      target: { value: 'New Restaurant' }
    });
    fireEvent.change(screen.getByLabelText(/tavsif/i), {
      target: { value: 'New Description' }
    });
    fireEvent.change(screen.getByLabelText(/manzil/i), {
      target: { value: 'New Address' }
    });
    fireEvent.change(screen.getByLabelText(/telefon/i), {
      target: { value: '+998909876543' }
    });
    
    // Saqlash
    fireEvent.click(screen.getByRole('button', { name: /saqlash/i }));
    
    // Yangi restoran qo'shilganini tekshirish
    expect(await screen.findByText('New Restaurant')).toBeInTheDocument();
  });

  test('edits restaurant', async () => {
    server.use(
      rest.put(`${API_URL}/admin/restaurants/1/`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            ...mockRestaurants.results[0],
            name: 'Updated Restaurant'
          })
        );
      })
    );

    render(<RestaurantsPage />, { preloadedState: mockAuthState });
    
    // Tahrirlash tugmasini bosish
    const editButton = await screen.findByTestId('edit-restaurant-1');
    fireEvent.click(editButton);
    
    // Nomni o'zgartirish
    const nameInput = screen.getByLabelText(/nomi/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Restaurant' } });
    
    // Saqlash
    fireEvent.click(screen.getByRole('button', { name: /saqlash/i }));
    
    // O'zgarishlar saqlanganini tekshirish
    expect(await screen.findByText('Updated Restaurant')).toBeInTheDocument();
  });

  test('deletes restaurant', async () => {
    server.use(
      rest.delete(`${API_URL}/admin/restaurants/1/`, (req, res, ctx) => {
        return res(ctx.status(204));
      })
    );

    render(<RestaurantsPage />, { preloadedState: mockAuthState });
    
    // O'chirish tugmasini bosish
    const deleteButton = await screen.findByTestId('delete-restaurant-1');
    fireEvent.click(deleteButton);
    
    // Tasdiqlash
    fireEvent.click(screen.getByRole('button', { name: /tasdiqlash/i }));
    
    // Restoran o'chirilganini tekshirish
    await waitFor(() => {
      expect(screen.queryByText('Test Restaurant 1')).not.toBeInTheDocument();
    });
  });

  test('toggles restaurant status', async () => {
    server.use(
      rest.patch(`${API_URL}/admin/restaurants/2/toggle/`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            ...mockRestaurants.results[1],
            isActive: true
          })
        );
      })
    );

    render(<RestaurantsPage />, { preloadedState: mockAuthState });
    
    // Status o'zgartirish tugmasini bosish
    const toggleButton = await screen.findByTestId('toggle-restaurant-2');
    fireEvent.click(toggleButton);
    
    // Status o'zgarganini tekshirish
    await waitFor(() => {
      expect(screen.getByText(/faol/i)).toBeInTheDocument();
    });
  });

  test('filters restaurants', async () => {
    render(<RestaurantsPage />, { preloadedState: mockAuthState });
    
    // Qidiruv
    const searchInput = screen.getByPlaceholderText(/qidirish/i);
    fireEvent.change(searchInput, { target: { value: 'Test Restaurant 1' } });
    
    await waitFor(() => {
      expect(screen.getByText('Test Restaurant 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Restaurant 2')).not.toBeInTheDocument();
    });
  });

  test('sorts restaurants', async () => {
    render(<RestaurantsPage />, { preloadedState: mockAuthState });
    
    // Reyting bo'yicha saralash
    const sortSelect = screen.getByLabelText(/saralash/i);
    fireEvent.change(sortSelect, { target: { value: 'rating' } });
    
    const restaurants = await screen.findAllByTestId('restaurant-row');
    const ratings = restaurants.map(row => 
      parseFloat(row.querySelector('[data-testid="rating"]').textContent)
    );
    
    expect(ratings).toEqual([4.5, 4.0]);
  });

  test('handles API error', async () => {
    server.use(
      rest.get(`${API_URL}/admin/restaurants/`, (req, res) => {
        return res.networkError('Failed to connect');
      })
    );

    render(<RestaurantsPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText(/ma'lumotlarni yuklashda xatolik/i)).toBeInTheDocument();
  });
}); 