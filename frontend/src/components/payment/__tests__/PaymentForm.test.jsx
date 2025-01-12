import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import PaymentForm from '../PaymentForm';
import {
  createPayment,
  initiatePaymePayment,
  initiateClickPayment
} from '../../../services/paymentService';

// Mock qilish
jest.mock('../../../services/paymentService');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'uz' }
  })
}));

describe('PaymentForm', () => {
  const mockProps = {
    orderId: '123',
    amount: 100000,
    onSuccess: jest.fn(),
    onCancel: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders payment form correctly', () => {
    render(<PaymentForm {...mockProps} />);

    expect(screen.getByText('payments.form.title')).toBeInTheDocument();
    expect(screen.getByLabelText('payments.form.amount')).toHaveValue('100,000');
    expect(screen.getByLabelText('payments.form.payment_type')).toBeInTheDocument();
    expect(screen.getByText('payments.form.submit')).toBeDisabled();
  });

  it('handles payment type selection', () => {
    render(<PaymentForm {...mockProps} />);

    const select = screen.getByLabelText('payments.form.payment_type');
    fireEvent.mouseDown(select);

    const paymeOption = screen.getByText('payments.types.payme');
    fireEvent.click(paymeOption);

    expect(select).toHaveValue('payme');
    expect(screen.getByText('payments.form.submit')).not.toBeDisabled();
  });

  it('handles Payme payment submission', async () => {
    const paymentUrl = 'https://test.payme.uz/payment';
    initiatePaymePayment.mockResolvedValueOnce({ payment_url: paymentUrl });

    const { container } = render(<PaymentForm {...mockProps} />);

    // To'lov turini tanlash
    const select = screen.getByLabelText('payments.form.payment_type');
    fireEvent.mouseDown(select);
    fireEvent.click(screen.getByText('payments.types.payme'));

    // To'lov tugmasini bosish
    const submitButton = screen.getByText('payments.form.submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(initiatePaymePayment).toHaveBeenCalledWith(
        mockProps.amount,
        mockProps.orderId
      );
    });
  });

  it('handles Click payment submission', async () => {
    const paymentUrl = 'https://test.click.uz/payment';
    initiateClickPayment.mockResolvedValueOnce({ payment_url: paymentUrl });

    render(<PaymentForm {...mockProps} />);

    // To'lov turini tanlash
    const select = screen.getByLabelText('payments.form.payment_type');
    fireEvent.mouseDown(select);
    fireEvent.click(screen.getByText('payments.types.click'));

    // To'lov tugmasini bosish
    const submitButton = screen.getByText('payments.form.submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(initiateClickPayment).toHaveBeenCalledWith(
        mockProps.amount,
        mockProps.orderId
      );
    });
  });

  it('handles cash payment submission', async () => {
    const mockPaymentResult = { id: '456', status: 'pending' };
    createPayment.mockResolvedValueOnce(mockPaymentResult);

    render(<PaymentForm {...mockProps} />);

    // To'lov turini tanlash
    const select = screen.getByLabelText('payments.form.payment_type');
    fireEvent.mouseDown(select);
    fireEvent.click(screen.getByText('payments.types.cash'));

    // To'lov tugmasini bosish
    const submitButton = screen.getByText('payments.form.submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledWith({
        order_id: mockProps.orderId,
        amount: mockProps.amount,
        payment_type: 'cash'
      });
      expect(mockProps.onSuccess).toHaveBeenCalledWith(mockPaymentResult);
      expect(screen.getByText('payments.messages.payment_success')).toBeInTheDocument();
    });
  });

  it('handles payment error', async () => {
    createPayment.mockRejectedValueOnce(new Error('Payment failed'));

    render(<PaymentForm {...mockProps} />);

    // To'lov turini tanlash
    const select = screen.getByLabelText('payments.form.payment_type');
    fireEvent.mouseDown(select);
    fireEvent.click(screen.getByText('payments.types.cash'));

    // To'lov tugmasini bosish
    const submitButton = screen.getByText('payments.form.submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('payments.messages.payment_error')).toBeInTheDocument();
    });
  });

  it('handles cancel button click', () => {
    render(<PaymentForm {...mockProps} />);

    const cancelButton = screen.getByText('payments.form.cancel');
    fireEvent.click(cancelButton);

    expect(mockProps.onCancel).toHaveBeenCalled();
  });
}); 