import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockAuthState } from '../../utils/test-utils';
import RestaurantPage from '../../pages/RestaurantPage';
import { server } from '../../mocks/server';
import { rest } from 'msw';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

describe('RestaurantPage', () => {
  const mockRestaurant = {
    id: 1,
    name: 'Test Restaurant',
    description: 'Test Description',
    rating: 4.5,
    address: 'Test Address',
    workingHours: '09:00 - 22:00',
    menu: [
      {
        id: 1,
        name: 'Test Dish 1',
        description: 'Test Dish Description 1',
        price: 50000,
        image: 'dish1.jpg',
        category: 'Main'
      },
      {
        id: 2,
        name: 'Test Dish 2',
        description: 'Test Dish Description 2',
        price: 35000,
        image: 'dish2.jpg',
        category: 'Dessert'
      }
    ]
  };

  beforeEach(() => {
    server.use(
      rest.get(`${API_URL}/restaurants/1/`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockRestaurant));
      })
    );
  });

  test('renders restaurant details', async () => {
    render(<RestaurantPage />, {
      initialRoute: '/restaurants/1'
    });
    
    expect(await screen.findByText('Test Restaurant')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('Test Address')).toBeInTheDocument();
    expect(screen.getByText('09:00 - 22:00')).toBeInTheDocument();
  });

  test('shows menu categories', async () => {
    render(<RestaurantPage />, {
      initialRoute: '/restaurants/1'
    });
    
    expect(await screen.findByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Dessert')).toBeInTheDocument();
  });

  test('filters menu by category', async () => {
    render(<RestaurantPage />, {
      initialRoute: '/restaurants/1'
    });
    
    await screen.findByText('Main');
    fireEvent.click(screen.getByText('Dessert'));
    
    expect(screen.queryByText('Test Dish 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test Dish 2')).toBeInTheDocument();
  });

  test('adds item to cart', async () => {
    const { store } = render(<RestaurantPage />, {
      initialRoute: '/restaurants/1',
      preloadedState: mockAuthState
    });
    
    const addButton = await screen.findByTestId('add-to-cart-1');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.cart.items).toHaveLength(1);
      expect(state.cart.items[0].name).toBe('Test Dish 1');
    });
  });

  test('shows error when restaurant not found', async () => {
    server.use(
      rest.get(`${API_URL}/restaurants/999/`, (req, res, ctx) => {
        return res(ctx.status(404));
      })
    );

    render(<RestaurantPage />, {
      initialRoute: '/restaurants/999'
    });
    
    expect(await screen.findByText(/restoran topilmadi/i)).toBeInTheDocument();
  });

  test('shows reviews section', async () => {
    server.use(
      rest.get(`${API_URL}/restaurants/1/reviews/`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            results: [
              {
                id: 1,
                user: 'Test User',
                rating: 5,
                comment: 'Great food!',
                createdAt: '2024-01-11T12:00:00Z'
              }
            ]
          })
        );
      })
    );

    render(<RestaurantPage />, {
      initialRoute: '/restaurants/1'
    });
    
    expect(await screen.findByText('Great food!')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  test('submits new review', async () => {
    const { store } = render(<RestaurantPage />, {
      initialRoute: '/restaurants/1',
      preloadedState: mockAuthState
    });
    
    // Review formani ochish
    fireEvent.click(screen.getByText(/sharh qoldirish/i));
    
    // Reyting tanlash
    fireEvent.click(screen.getAllByTestId('star-rating')[4]);
    
    // Sharh yozish
    fireEvent.change(screen.getByPlaceholderText(/sharh/i), {
      target: { value: 'Test review' }
    });
    
    // Formani yuborish
    fireEvent.click(screen.getByRole('button', { name: /yuborish/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Test review')).toBeInTheDocument();
    });
  });

  test('shows working hours status', async () => {
    const currentHour = new Date().getHours();
    const isOpen = currentHour >= 9 && currentHour < 22;
    
    render(<RestaurantPage />, {
      initialRoute: '/restaurants/1'
    });
    
    expect(await screen.findByText(isOpen ? /ochiq/i : /yopiq/i)).toBeInTheDocument();
  });
}); 