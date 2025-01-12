import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../utils/test-utils';
import RestaurantStats from '../../../components/statistics/RestaurantStats';

describe('RestaurantStats', () => {
  const mockData = {
    overview: {
      totalRestaurants: 50,
      activeRestaurants: 45,
      newRestaurants: 5,
      averageRating: 4.5
    },
    performance: [
      {
        id: 1,
        name: 'Test Restaurant 1',
        orders: 500,
        revenue: 15000000,
        rating: 4.8,
        customerSatisfaction: 95
      },
      {
        id: 2,
        name: 'Test Restaurant 2',
        orders: 400,
        revenue: 12000000,
        rating: 4.5,
        customerSatisfaction: 90
      }
    ],
    categories: [
      { name: 'Fast Food', count: 20, revenue: 30000000 },
      { name: 'Milliy Taomlar', count: 15, revenue: 25000000 }
    ],
    topDishes: [
      { id: 1, name: 'Test Dish 1', restaurant: 'Test Restaurant 1', orderCount: 200 },
      { id: 2, name: 'Test Dish 2', restaurant: 'Test Restaurant 2', orderCount: 150 }
    ],
    revenueByTime: [
      { hour: 12, revenue: 5000000 },
      { hour: 13, revenue: 6000000 }
    ]
  };

  const defaultProps = {
    data: mockData,
    loading: false
  };

  test('renders restaurant overview', () => {
    render(<RestaurantStats {...defaultProps} />);
    
    expect(screen.getByText('50')).toBeInTheDocument(); // Jami restoranlar
    expect(screen.getByText('45')).toBeInTheDocument(); // Faol restoranlar
    expect(screen.getByText('5')).toBeInTheDocument(); // Yangi restoranlar
    expect(screen.getByText('4.5')).toBeInTheDocument(); // O'rtacha reyting
  });

  test('shows loading state', () => {
    render(<RestaurantStats {...defaultProps} loading={true} />);
    
    expect(screen.getByTestId('stats-loader')).toBeInTheDocument();
  });

  test('displays performance table', () => {
    render(<RestaurantStats {...defaultProps} />);
    
    expect(screen.getByText('Test Restaurant 1')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument(); // Buyurtmalar soni
    expect(screen.getByText('15,000,000')).toBeInTheDocument(); // Tushum
    expect(screen.getByText('4.8')).toBeInTheDocument(); // Reyting
  });

  test('shows category distribution', () => {
    render(<RestaurantStats {...defaultProps} />);
    
    expect(screen.getByText('Fast Food')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument(); // Restoranlar soni
    expect(screen.getByText('30,000,000')).toBeInTheDocument(); // Tushum
  });

  test('displays top dishes', () => {
    render(<RestaurantStats {...defaultProps} />);
    
    expect(screen.getByText('Test Dish 1')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument(); // Buyurtmalar soni
  });

  test('shows revenue by time chart', () => {
    render(<RestaurantStats {...defaultProps} />);
    
    expect(screen.getByTestId('revenue-time-chart')).toBeInTheDocument();
    expect(screen.getByText('12:00')).toBeInTheDocument();
    expect(screen.getByText('5,000,000')).toBeInTheDocument();
  });

  test('filters data by date range', async () => {
    const onFilterChange = jest.fn();
    render(<RestaurantStats {...defaultProps} onFilterChange={onFilterChange} />);
    
    const dateRangeSelect = screen.getByLabelText(/sana oralig'i/i);
    fireEvent.change(dateRangeSelect, { target: { value: 'week' } });
    
    await waitFor(() => {
      expect(onFilterChange).toHaveBeenCalledWith({ period: 'week' });
    });
  });

  test('sorts performance table', () => {
    render(<RestaurantStats {...defaultProps} />);
    
    const revenueHeader = screen.getByText(/tushum/i);
    fireEvent.click(revenueHeader);
    
    const restaurants = screen.getAllByTestId('restaurant-row');
    expect(restaurants[0]).toHaveTextContent('15,000,000');
  });

  test('exports restaurant data', async () => {
    render(<RestaurantStats {...defaultProps} />);
    
    const exportButton = screen.getByText(/eksport/i);
    fireEvent.click(exportButton);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    const formatSelect = screen.getByLabelText(/format/i);
    fireEvent.change(formatSelect, { target: { value: 'csv' } });
    
    fireEvent.click(screen.getByText(/yuklash/i));
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('shows restaurant details', () => {
    render(<RestaurantStats {...defaultProps} />);
    
    const viewButton = screen.getByTestId('view-restaurant-1');
    fireEvent.click(viewButton);
    
    expect(screen.getByTestId('restaurant-details')).toBeInTheDocument();
    expect(screen.getByText('Test Restaurant 1')).toBeInTheDocument();
  });

  test('filters by category', async () => {
    render(<RestaurantStats {...defaultProps} />);
    
    const categorySelect = screen.getByLabelText(/kategoriya/i);
    fireEvent.change(categorySelect, { target: { value: 'Fast Food' } });
    
    await waitFor(() => {
      const restaurants = screen.getAllByTestId('restaurant-row');
      expect(restaurants).toHaveLength(1);
    });
  });

  test('shows comparison chart', () => {
    render(<RestaurantStats {...defaultProps} showComparison={true} />);
    
    expect(screen.getByTestId('comparison-chart')).toBeInTheDocument();
    expect(screen.getByText(/taqqoslash/i)).toBeInTheDocument();
  });
}); 