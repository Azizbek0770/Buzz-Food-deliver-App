import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../utils/test-utils';
import PaymentConfirmation from '../../../components/payment/PaymentConfirmation';

describe('PaymentConfirmation', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnRetry = jest.fn();

  const defaultProps = {
    paymentId: 'test-payment-123',
    amount: 100000,
    method: 'payme',
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel,
    onRetry: mockOnRetry,
    isLoading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders payment details', () => {
    render(<PaymentConfirmation {...defaultProps} />);
    
    expect(screen.getByText(/to'lov miqdori/i)).toBeInTheDocument();
    expect(screen.getByText('100,000')).toBeInTheDocument();
    expect(screen.getByText(/payme/i)).toBeInTheDocument();
    expect(screen.getByText('test-payment-123')).toBeInTheDocument();
  });

  test('shows countdown timer', () => {
    jest.useFakeTimers();
    render(<PaymentConfirmation {...defaultProps} timeout={300} />);
    
    expect(screen.getByText('5:00')).toBeInTheDocument();
    
    // 1 daqiqa o'tkazish
    jest.advanceTimersByTime(60000);
    
    expect(screen.getByText('4:00')).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  test('handles timeout', async () => {
    jest.useFakeTimers();
    render(<PaymentConfirmation {...defaultProps} timeout={300} />);
    
    // 5 daqiqa o'tkazish
    jest.advanceTimersByTime(300000);
    
    await waitFor(() => {
      expect(screen.getByText(/to'lov muddati tugadi/i)).toBeInTheDocument();
    });
    
    expect(screen.getByRole('button', { name: /qayta urinish/i })).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  test('shows QR code for mobile payment', () => {
    render(<PaymentConfirmation {...defaultProps} method="payme" />);
    
    expect(screen.getByTestId('payment-qr-code')).toBeInTheDocument();
    expect(screen.getByText(/mobil ilova orqali to'lang/i)).toBeInTheDocument();
  });

  test('shows payment instructions', () => {
    render(<PaymentConfirmation {...defaultProps} />);
    
    expect(screen.getByText(/to'lov yo'riqnomasi/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. mobil ilovani oching/i)).toBeInTheDocument();
  });

  test('handles successful payment', async () => {
    render(<PaymentConfirmation {...defaultProps} status="success" />);
    
    expect(screen.getByText(/to'lov muvaffaqiyatli amalga oshirildi/i)).toBeInTheDocument();
    
    const confirmButton = screen.getByRole('button', { name: /tasdiqlash/i });
    fireEvent.click(confirmButton);
    
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  test('handles failed payment', () => {
    render(<PaymentConfirmation {...defaultProps} status="failed" error="To'lov rad etildi" />);
    
    expect(screen.getByText(/to'lov rad etildi/i)).toBeInTheDocument();
    
    const retryButton = screen.getByRole('button', { name: /qayta urinish/i });
    fireEvent.click(retryButton);
    
    expect(mockOnRetry).toHaveBeenCalled();
  });

  test('handles payment cancellation', () => {
    render(<PaymentConfirmation {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /bekor qilish/i });
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('shows loading state during verification', () => {
    render(<PaymentConfirmation {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText(/to'lov tekshirilmoqda/i)).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('disables buttons during loading', () => {
    render(<PaymentConfirmation {...defaultProps} isLoading={true} />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  test('shows copy button for payment ID', () => {
    render(<PaymentConfirmation {...defaultProps} />);
    
    const copyButton = screen.getByRole('button', { name: /nusxa olish/i });
    fireEvent.click(copyButton);
    
    expect(screen.getByText(/nusxa olindi/i)).toBeInTheDocument();
  });
}); 