import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockAuthState } from '../../utils/test-utils';
import HomePage from '../../pages/HomePage';
import { server } from '../../mocks/server';
import { rest } from 'msw';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

describe('HomePage', () => {
  test('renders main sections', () => {
    render(<HomePage />);
    
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('categories-section')).toBeInTheDocument();
    expect(screen.getByTestId('popular-restaurants')).toBeInTheDocument();
  });

  test('shows featured restaurants', async () => {
    render(<HomePage />);
    
    const featuredRestaurants = await screen.findAllByTestId('featured-restaurant-card');
    expect(featuredRestaurants.length).toBeGreaterThan(0);
  });

  test('shows categories with icons', async () => {
    render(<HomePage />);
    
    const categories = await screen.findAllByTestId('category-item');
    expect(categories.length).toBeGreaterThan(0);
    
    categories.forEach(category => {
      expect(category.querySelector('img')).toBeInTheDocument();
      expect(category.querySelector('span')).toBeInTheDocument();
    });
  });

  test('navigates to restaurant page on card click', async () => {
    const { history } = render(<HomePage />);
    
    const restaurantCard = await screen.findByText('Test Restaurant 1');
    fireEvent.click(restaurantCard);
    
    expect(history.location.pathname).toBe('/restaurants/1');
  });

  test('filters restaurants by category click', async () => {
    render(<HomePage />);
    
    const categoryItem = await screen.findByText('Fast Food');
    fireEvent.click(categoryItem);
    
    await waitFor(() => {
      const restaurants = screen.getAllByTestId('restaurant-card');
      expect(restaurants.length).toBeGreaterThan(0);
    });
  });

  test('shows loading state', () => {
    render(<HomePage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('handles API error', async () => {
    server.use(
      rest.get(`${API_URL}/restaurants/`, (req, res) => {
        return res.networkError('Failed to connect');
      })
    );

    render(<HomePage />);
    expect(await screen.findByText(/ma'lumotlarni yuklashda xatolik/i)).toBeInTheDocument();
  });

  test('shows search suggestions on input focus', async () => {
    render(<HomePage />);
    
    const searchInput = screen.getByPlaceholderText(/qidirish/i);
    fireEvent.focus(searchInput);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(screen.getByTestId('search-suggestions')).toBeInTheDocument();
      expect(screen.getAllByTestId('suggestion-item').length).toBeGreaterThan(0);
    });
  });

  test('shows empty state when no restaurants found', async () => {
    server.use(
      rest.get(`${API_URL}/restaurants/`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            results: [],
            count: 0
          })
        );
      })
    );

    render(<HomePage />);
    expect(await screen.findByTestId('empty-state')).toBeInTheDocument();
  });
}); 