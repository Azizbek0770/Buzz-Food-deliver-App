import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MenuList from './MenuList';
import api from '../../services/api';

jest.mock('../../services/api');

const mockMenuItems = [
  {
    id: 1,
    name: "Osh",
    description: "Palov",
    price: 35000,
    category: "Main",
    image: "osh.jpg"
  },
  {
    id: 2,
    name: "Lag'mon",
    description: "Lag'mon",
    price: 30000,
    category: "Main",
    image: "lagmon.jpg"
  }
];

describe('MenuList Component', () => {
  beforeEach(() => {
    api.get.mockReset();
  });

  test('renders loading state initially', () => {
    api.get.mockResolvedValueOnce({ data: [] });
    render(<MenuList restaurantId={1} onAddToCart={() => {}} />);
    expect(screen.getByText('Yuklanmoqda...')).toBeInTheDocument();
  });

  test('renders menu items after loading', async () => {
    api.get.mockResolvedValueOnce({ data: mockMenuItems });
    render(<MenuList restaurantId={1} onAddToCart={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Osh')).toBeInTheDocument();
      expect(screen.getByText("Lag'mon")).toBeInTheDocument();
    });
  });

  test('filters menu items by category', async () => {
    api.get.mockResolvedValueOnce({ data: mockMenuItems });
    render(<MenuList restaurantId={1} onAddToCart={() => {}} />);

    await waitFor(() => {
      const categoryButton = screen.getByText('Main');
      fireEvent.click(categoryButton);
      expect(screen.getByText('Osh')).toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    api.get.mockRejectedValueOnce(new Error('API Error'));
    render(<MenuList restaurantId={1} onAddToCart={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Menyu elementlarini yuklashda xatolik yuz berdi')).toBeInTheDocument();
    });
  });
}); 