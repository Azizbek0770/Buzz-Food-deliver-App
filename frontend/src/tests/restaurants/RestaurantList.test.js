import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import RestaurantList from '../../components/restaurants/RestaurantList';
import { server } from '../../mocks/server';
import { rest } from 'msw';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

describe('RestaurantList Component', () => {
  test('renders loading state initially', () => {
    render(<RestaurantList />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders restaurant list after loading', async () => {
    render(<RestaurantList />);
    
    const restaurants = await screen.findAllByTestId('restaurant-card');
    expect(restaurants).toHaveLength(2);
    
    expect(screen.getByText('Test Restaurant 1')).toBeInTheDocument();
    expect(screen.getByText('Test Restaurant 2')).toBeInTheDocument();
  });

  test('shows error message when API fails', async () => {
    server.use(
      rest.get(`${API_URL}/restaurants/`, (req, res) => {
        return res.networkError('Failed to connect');
      })
    );

    render(<RestaurantList />);
    
    expect(await screen.findByText(/ma'lumotlarni yuklashda xatolik/i)).toBeInTheDocument();
  });

  test('filters restaurants by category', async () => {
    const { store } = render(<RestaurantList />);
    
    // Kategoriya tanlash
    const categoryFilter = screen.getByLabelText(/kategoriya/i);
    fireEvent.change(categoryFilter, { target: { value: '1' } });
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.restaurants.filter.category).toBe('1');
    });
  });

  test('searches restaurants by name', async () => {
    render(<RestaurantList />);
    
    const searchInput = screen.getByPlaceholderText(/qidirish/i);
    fireEvent.change(searchInput, { target: { value: 'Test Restaurant 1' } });
    
    await waitFor(() => {
      const restaurants = screen.getAllByTestId('restaurant-card');
      expect(restaurants).toHaveLength(1);
      expect(screen.getByText('Test Restaurant 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Restaurant 2')).not.toBeInTheDocument();
    });
  });

  test('sorts restaurants by rating', async () => {
    render(<RestaurantList />);
    
    const sortSelect = screen.getByLabelText(/saralash/i);
    fireEvent.change(sortSelect, { target: { value: 'rating' } });
    
    const restaurants = await screen.findAllByTestId('restaurant-card');
    const ratings = restaurants.map(card => 
      parseFloat(card.querySelector('[data-testid="rating"]').textContent)
    );
    
    expect(ratings).toEqual([4.5, 4.0]);
  });

  test('handles pagination', async () => {
    server.use(
      rest.get(`${API_URL}/restaurants/`, (req, res, ctx) => {
        const page = req.url.searchParams.get('page') || '1';
        return res(
          ctx.status(200),
          ctx.json({
            results: [
              {
                id: page === '1' ? 1 : 3,
                name: `Test Restaurant ${page === '1' ? 1 : 3}`,
                rating: 4.5,
                address: `Test address ${page === '1' ? 1 : 3}`
              }
            ],
            count: 3
          })
        );
      })
    );

    render(<RestaurantList />);
    
    // Birinchi sahifani tekshirish
    expect(await screen.findByText('Test Restaurant 1')).toBeInTheDocument();
    
    // Keyingi sahifaga o'tish
    fireEvent.click(screen.getByLabelText('Next page'));
    
    // Ikkinchi sahifani tekshirish
    expect(await screen.findByText('Test Restaurant 3')).toBeInTheDocument();
  });
}); 