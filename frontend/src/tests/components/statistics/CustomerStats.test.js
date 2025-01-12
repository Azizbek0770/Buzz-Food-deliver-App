import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../utils/test-utils';
import CustomerStats from '../../../components/statistics/CustomerStats';

describe('CustomerStats', () => {
  const mockData = {
    overview: {
      totalCustomers: 1000,
      newCustomers: 50,
      returningCustomers: 150,
      activeCustomers: 800
    },
    customerActivity: [
      { date: '2024-01-11', newCustomers: 10, returningCustomers: 30 },
      { date: '2024-01-10', newCustomers: 15, returningCustomers: 25 }
    ],
    customerSegments: [
      { segment: 'regular', count: 500, percentage: 50 },
      { segment: 'occasional', count: 300, percentage: 30 },
      { segment: 'inactive', count: 200, percentage: 20 }
    ],
    orderFrequency: {
      daily: 100,
      weekly: 300,
      monthly: 500,
      rarely: 100
    },
    satisfaction: {
      average: 4.5,
      distribution: {
        5: 500,
        4: 300,
        3: 150,
        2: 40,
        1: 10
      }
    }
  };

  const defaultProps = {
    data: mockData,
    loading: false
  };

  test('renders customer overview', () => {
    render(<CustomerStats {...defaultProps} />);
    
    expect(screen.getByText('1,000')).toBeInTheDocument(); // Jami mijozlar
    expect(screen.getByText('50')).toBeInTheDocument(); // Yangi mijozlar
    expect(screen.getByText('150')).toBeInTheDocument(); // Doimiy mijozlar
    expect(screen.getByText('800')).toBeInTheDocument(); // Faol mijozlar
  });

  test('shows loading state', () => {
    render(<CustomerStats {...defaultProps} loading={true} />);
    
    expect(screen.getByTestId('stats-loader')).toBeInTheDocument();
  });

  test('displays customer activity chart', () => {
    render(<CustomerStats {...defaultProps} />);
    
    expect(screen.getByTestId('activity-chart')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // Yangi mijozlar soni
    expect(screen.getByText('30')).toBeInTheDocument(); // Doimiy mijozlar soni
  });

  test('shows customer segments', () => {
    render(<CustomerStats {...defaultProps} />);
    
    expect(screen.getByText(/doimiy/i)).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  test('displays order frequency', () => {
    render(<CustomerStats {...defaultProps} />);
    
    expect(screen.getByText('100')).toBeInTheDocument(); // Kunlik
    expect(screen.getByText('300')).toBeInTheDocument(); // Haftalik
    expect(screen.getByText('500')).toBeInTheDocument(); // Oylik
  });

  test('shows satisfaction metrics', () => {
    render(<CustomerStats {...defaultProps} />);
    
    expect(screen.getByText('4.5')).toBeInTheDocument(); // O'rtacha baho
    expect(screen.getByTestId('satisfaction-chart')).toBeInTheDocument();
  });

  test('filters data by date range', async () => {
    const onFilterChange = jest.fn();
    render(<CustomerStats {...defaultProps} onFilterChange={onFilterChange} />);
    
    const dateRangeSelect = screen.getByLabelText(/sana oralig'i/i);
    fireEvent.change(dateRangeSelect, { target: { value: 'week' } });
    
    await waitFor(() => {
      expect(onFilterChange).toHaveBeenCalledWith({ period: 'week' });
    });
  });

  test('shows customer details on segment click', () => {
    render(<CustomerStats {...defaultProps} />);
    
    const regularSegment = screen.getByText(/doimiy/i);
    fireEvent.click(regularSegment);
    
    expect(screen.getByTestId('segment-details')).toBeInTheDocument();
    expect(screen.getByText('500 mijoz')).toBeInTheDocument();
  });

  test('exports customer data', async () => {
    render(<CustomerStats {...defaultProps} />);
    
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

  test('shows empty state', () => {
    render(<CustomerStats {...defaultProps} data={null} />);
    
    expect(screen.getByText(/ma'lumot mavjud emas/i)).toBeInTheDocument();
  });

  test('updates chart on segment selection', () => {
    render(<CustomerStats {...defaultProps} />);
    
    const segmentSelect = screen.getByLabelText(/segment/i);
    fireEvent.change(segmentSelect, { target: { value: 'regular' } });
    
    expect(screen.getByTestId('segment-chart')).toBeInTheDocument();
    expect(screen.getByText('500 doimiy mijoz')).toBeInTheDocument();
  });

  test('shows tooltips on hover', () => {
    render(<CustomerStats {...defaultProps} />);
    
    const dataPoint = screen.getByTestId('satisfaction-point-5');
    fireEvent.mouseOver(dataPoint);
    
    expect(screen.getByText('500 mijoz 5 ball bergan')).toBeInTheDocument();
  });
}); 