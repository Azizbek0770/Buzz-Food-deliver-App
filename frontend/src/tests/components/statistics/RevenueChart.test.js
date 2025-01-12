import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../utils/test-utils';
import RevenueChart from '../../../components/statistics/RevenueChart';

describe('RevenueChart', () => {
  const mockData = [
    { date: '2024-01-11', revenue: 1500000 },
    { date: '2024-01-10', revenue: 1350000 },
    { date: '2024-01-09', revenue: 1200000 },
    { date: '2024-01-08', revenue: 1400000 },
    { date: '2024-01-07', revenue: 1600000 }
  ];

  const defaultProps = {
    data: mockData,
    title: "Kunlik tushum",
    loading: false
  };

  test('renders chart', () => {
    render(<RevenueChart {...defaultProps} />);
    
    expect(screen.getByTestId('revenue-chart')).toBeInTheDocument();
    expect(screen.getByText('Kunlik tushum')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(<RevenueChart {...defaultProps} loading={true} />);
    
    expect(screen.getByTestId('chart-loader')).toBeInTheDocument();
  });

  test('displays revenue data', () => {
    render(<RevenueChart {...defaultProps} />);
    
    // Tushumlarni tekshirish
    expect(screen.getByText('1,500,000')).toBeInTheDocument();
    expect(screen.getByText('1,350,000')).toBeInTheDocument();
  });

  test('shows date labels', () => {
    render(<RevenueChart {...defaultProps} />);
    
    // Sanalarni tekshirish
    expect(screen.getByText('11.01')).toBeInTheDocument();
    expect(screen.getByText('10.01')).toBeInTheDocument();
  });

  test('handles empty data', () => {
    render(<RevenueChart {...defaultProps} data={[]} />);
    
    expect(screen.getByText(/ma'lumot mavjud emas/i)).toBeInTheDocument();
  });

  test('shows tooltip on hover', () => {
    render(<RevenueChart {...defaultProps} />);
    
    const dataPoint = screen.getByTestId('data-point-0');
    fireEvent.mouseOver(dataPoint);
    
    expect(screen.getByText('11.01.2024')).toBeInTheDocument();
    expect(screen.getByText('1,500,000 so\'m')).toBeInTheDocument();
  });

  test('changes chart type', () => {
    render(<RevenueChart {...defaultProps} />);
    
    const typeSelect = screen.getByLabelText(/diagramma turi/i);
    fireEvent.change(typeSelect, { target: { value: 'bar' } });
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  test('shows average line', () => {
    render(<RevenueChart {...defaultProps} showAverage={true} />);
    
    expect(screen.getByTestId('average-line')).toBeInTheDocument();
    expect(screen.getByText(/o'rtacha/i)).toBeInTheDocument();
  });

  test('handles data updates', () => {
    const { rerender } = render(<RevenueChart {...defaultProps} />);
    
    const newData = [
      { date: '2024-01-12', revenue: 1700000 },
      ...mockData
    ];
    
    rerender(<RevenueChart {...defaultProps} data={newData} />);
    
    expect(screen.getByText('1,700,000')).toBeInTheDocument();
  });

  test('shows custom date range', () => {
    const customRange = {
      startDate: '2024-01-07',
      endDate: '2024-01-11'
    };
    
    render(<RevenueChart {...defaultProps} dateRange={customRange} />);
    
    expect(screen.getByText('07.01 - 11.01')).toBeInTheDocument();
  });

  test('handles zoom controls', () => {
    render(<RevenueChart {...defaultProps} />);
    
    const zoomInButton = screen.getByLabelText(/kattalashtirish/i);
    fireEvent.click(zoomInButton);
    
    expect(screen.getByTestId('zoomed-chart')).toBeInTheDocument();
  });
}); 