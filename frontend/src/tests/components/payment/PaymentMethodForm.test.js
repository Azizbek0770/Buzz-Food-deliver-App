import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../utils/test-utils';
import PaymentMethodForm from '../../../components/payment/PaymentMethodForm';

describe('PaymentMethodForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    amount: 100000,
    isLoading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders payment methods', () => {
    render(<PaymentMethodForm {...defaultProps} />);
    
    expect(screen.getByText(/payme/i)).toBeInTheDocument();
    expect(screen.getByText(/click/i)).toBeInTheDocument();
    expect(screen.getByText(/naqd pul/i)).toBeInTheDocument();
  });

  test('selects payment method', () => {
    render(<PaymentMethodForm {...defaultProps} />);
    
    const paymeMethod = screen.getByTestId('payment-method-payme');
    fireEvent.click(paymeMethod);
    
    expect(paymeMethod).toHaveClass('selected');
  });

  test('shows amount in selected currency', () => {
    render(<PaymentMethodForm {...defaultProps} />);
    
    expect(screen.getByText('100,000')).toBeInTheDocument();
    expect(screen.getByText(/so'm/i)).toBeInTheDocument();
  });

  test('validates card number for card payment', async () => {
    render(<PaymentMethodForm {...defaultProps} />);
    
    // Karta to'lovini tanlash
    const cardMethod = screen.getByTestId('payment-method-card');
    fireEvent.click(cardMethod);
    
    // Noto'g'ri karta raqamini kiritish
    const cardInput = screen.getByLabelText(/karta raqami/i);
    fireEvent.change(cardInput, { target: { value: '1234' } });
    
    // To'lash tugmasini bosish
    fireEvent.click(screen.getByRole('button', { name: /to'lash/i }));
    
    // Xatolik xabarini tekshirish
    expect(await screen.findByText(/karta raqami noto'g'ri/i)).toBeInTheDocument();
  });

  test('validates expiry date for card payment', async () => {
    render(<PaymentMethodForm {...defaultProps} />);
    
    // Karta to'lovini tanlash
    const cardMethod = screen.getByTestId('payment-method-card');
    fireEvent.click(cardMethod);
    
    // Noto'g'ri amal qilish muddatini kiritish
    const expiryInput = screen.getByLabelText(/amal qilish muddati/i);
    fireEvent.change(expiryInput, { target: { value: '13/24' } });
    
    // To'lash tugmasini bosish
    fireEvent.click(screen.getByRole('button', { name: /to'lash/i }));
    
    // Xatolik xabarini tekshirish
    expect(await screen.findByText(/amal qilish muddati noto'g'ri/i)).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    render(<PaymentMethodForm {...defaultProps} />);
    
    // Payme usulini tanlash
    const paymeMethod = screen.getByTestId('payment-method-payme');
    fireEvent.click(paymeMethod);
    
    // To'lash tugmasini bosish
    fireEvent.click(screen.getByRole('button', { name: /to'lash/i }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        method: 'payme',
        amount: 100000
      });
    });
  });

  test('shows loading state', () => {
    render(<PaymentMethodForm {...defaultProps} isLoading={true} />);
    
    expect(screen.getByRole('button', { name: /to'lanmoqda/i })).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('handles cancel', () => {
    render(<PaymentMethodForm {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /bekor qilish/i }));
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('shows error message', () => {
    render(<PaymentMethodForm {...defaultProps} error="To'lov amalga oshmadi" />);
    
    expect(screen.getByText(/to'lov amalga oshmadi/i)).toBeInTheDocument();
  });

  test('disables form during loading', () => {
    render(<PaymentMethodForm {...defaultProps} isLoading={true} />);
    
    const paymentMethods = screen.getAllByTestId(/payment-method/);
    paymentMethods.forEach(method => {
      expect(method).toBeDisabled();
    });
  });
}); 