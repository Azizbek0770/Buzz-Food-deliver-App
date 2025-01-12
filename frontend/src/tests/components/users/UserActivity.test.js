import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../utils/test-utils';
import UserActivity from '../../../components/users/UserActivity';

describe('UserActivity', () => {
  const mockActivity = [
    {
      id: 1,
      type: 'login',
      details: {
        ip: '192.168.1.1',
        device: 'Chrome on Windows'
      },
      createdAt: '2024-01-11T12:00:00Z'
    },
    {
      id: 2,
      type: 'order_created',
      details: {
        orderId: 123,
        amount: 100000
      },
      createdAt: '2024-01-11T11:00:00Z'
    },
    {
      id: 3,
      type: 'profile_updated',
      details: {
        fields: ['phone', 'address']
      },
      createdAt: '2024-01-11T10:00:00Z'
    }
  ];

  const defaultProps = {
    userId: 1,
    activity: mockActivity,
    loading: false
  };

  test('renders activity list', () => {
    render(<UserActivity {...defaultProps} />);
    
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/order_created/i)).toBeInTheDocument();
    expect(screen.getByText(/profile_updated/i)).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(<UserActivity {...defaultProps} loading={true} />);
    
    expect(screen.getByTestId('activity-loader')).toBeInTheDocument();
  });

  test('displays activity details', () => {
    render(<UserActivity {...defaultProps} />);
    
    // Login faoliyati
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
    expect(screen.getByText('Chrome on Windows')).toBeInTheDocument();
    
    // Buyurtma faoliyati
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('100,000')).toBeInTheDocument();
  });

  test('formats dates correctly', () => {
    render(<UserActivity {...defaultProps} />);
    
    expect(screen.getByText('12:00')).toBeInTheDocument();
    expect(screen.getByText('11.01.2024')).toBeInTheDocument();
  });

  test('filters activity by type', async () => {
    render(<UserActivity {...defaultProps} />);
    
    const typeSelect = screen.getByLabelText(/faoliyat turi/i);
    fireEvent.change(typeSelect, { target: { value: 'login' } });
    
    await waitFor(() => {
      expect(screen.getByText(/login/i)).toBeInTheDocument();
      expect(screen.queryByText(/order_created/i)).not.toBeInTheDocument();
    });
  });

  test('filters activity by date range', async () => {
    render(<UserActivity {...defaultProps} />);
    
    const dateRangeSelect = screen.getByLabelText(/sana oralig'i/i);
    fireEvent.change(dateRangeSelect, { target: { value: 'today' } });
    
    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });
  });

  test('shows empty state', () => {
    render(<UserActivity {...defaultProps} activity={[]} />);
    
    expect(screen.getByText(/faoliyat mavjud emas/i)).toBeInTheDocument();
  });

  test('expands activity details', () => {
    render(<UserActivity {...defaultProps} />);
    
    const expandButton = screen.getAllByTestId('expand-button')[0];
    fireEvent.click(expandButton);
    
    expect(screen.getByTestId('activity-details')).toBeInTheDocument();
  });

  test('exports activity history', async () => {
    render(<UserActivity {...defaultProps} />);
    
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

  test('loads more activity', async () => {
    const onLoadMore = jest.fn();
    render(<UserActivity {...defaultProps} hasMore={true} onLoadMore={onLoadMore} />);
    
    const loadMoreButton = screen.getByText(/ko'proq yuklash/i);
    fireEvent.click(loadMoreButton);
    
    expect(onLoadMore).toHaveBeenCalled();
  });

  test('shows activity icons', () => {
    render(<UserActivity {...defaultProps} />);
    
    expect(screen.getByTestId('login-icon')).toBeInTheDocument();
    expect(screen.getByTestId('order-icon')).toBeInTheDocument();
    expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
  });

  test('groups activity by date', () => {
    render(<UserActivity {...defaultProps} />);
    
    expect(screen.getByText('11 Yanvar 2024')).toBeInTheDocument();
  });

  test('handles error state', () => {
    render(<UserActivity {...defaultProps} error="Ma'lumotlarni yuklashda xatolik" />);
    
    expect(screen.getByText(/ma'lumotlarni yuklashda xatolik/i)).toBeInTheDocument();
  });
}); 