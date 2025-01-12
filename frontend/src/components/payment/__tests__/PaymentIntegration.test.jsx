import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import PaymentDashboard from '../PaymentDashboard';
import PaymentForm from '../PaymentForm';
import PaymentHistory from '../PaymentHistory';
import {
  fetchPaymentStatistics,
  fetchPaymentHistory,
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

describe('Payment Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Payment Dashboard Integration', () => {
    const mockStatistics = {
      total_statistics: {
        total_payments: 10,
        total_amount: 1000000,
        successful_payments: 8,
        failed_payments: 2
      },
      payment_types: [
        { payment_type: 'click', count: 5, total: 500000 },
        { payment_type: 'payme', count: 5, total: 500000 }
      ],
      daily_statistics: [
        { date: '2023-01-01', count: 5, total: 500000 },
        { date: '2023-01-02', count: 5, total: 500000 }
      ]
    };

    it('loads and displays payment statistics', async () => {
      fetchPaymentStatistics.mockResolvedValueOnce(mockStatistics);

      render(
        <MemoryRouter>
          <PaymentDashboard />
        </MemoryRouter>
      );

      // Yuklash indikatori ko'rsatilishini tekshirish
      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      // Statistika yuklangandan keyin ko'rsatilishini tekshirish
      await waitFor(() => {
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('1,000,000')).toBeInTheDocument();
        expect(screen.getByText('8')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });
  });

  describe('Payment Flow Integration', () => {
    const mockOrder = {
      id: '123',
      amount: 100000
    };

    it('completes full payment flow with Click', async () => {
      const clickPaymentUrl = 'https://test.click.uz/payment';
      initiateClickPayment.mockResolvedValueOnce({ payment_url: clickPaymentUrl });

      render(
        <MemoryRouter>
          <PaymentForm
            orderId={mockOrder.id}
            amount={mockOrder.amount}
            onSuccess={jest.fn()}
            onCancel={jest.fn()}
          />
        </MemoryRouter>
      );

      // To'lov turini tanlash
      const select = screen.getByLabelText('payments.form.payment_type');
      fireEvent.mouseDown(select);
      fireEvent.click(screen.getByText('payments.types.click'));

      // To'lovni boshlash
      const submitButton = screen.getByText('payments.form.submit');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(initiateClickPayment).toHaveBeenCalledWith(
          mockOrder.amount,
          mockOrder.id
        );
      });
    });

    it('completes full payment flow with Payme', async () => {
      const paymePaymentUrl = 'https://test.payme.uz/payment';
      initiatePaymePayment.mockResolvedValueOnce({ payment_url: paymePaymentUrl });

      render(
        <MemoryRouter>
          <PaymentForm
            orderId={mockOrder.id}
            amount={mockOrder.amount}
            onSuccess={jest.fn()}
            onCancel={jest.fn()}
          />
        </MemoryRouter>
      );

      // To'lov turini tanlash
      const select = screen.getByLabelText('payments.form.payment_type');
      fireEvent.mouseDown(select);
      fireEvent.click(screen.getByText('payments.types.payme'));

      // To'lovni boshlash
      const submitButton = screen.getByText('payments.form.submit');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(initiatePaymePayment).toHaveBeenCalledWith(
          mockOrder.amount,
          mockOrder.id
        );
      });
    });
  });

  describe('Payment History Integration', () => {
    const mockPayments = [
      {
        id: '1',
        payment_type: 'click',
        amount: 100000,
        status: 'completed',
        created_at: '2023-01-01T12:00:00Z'
      },
      {
        id: '2',
        payment_type: 'payme',
        amount: 50000,
        status: 'failed',
        created_at: '2023-01-02T12:00:00Z'
      }
    ];

    it('loads and displays payment history', async () => {
      fetchPaymentHistory.mockResolvedValueOnce(mockPayments);

      render(
        <MemoryRouter>
          <PaymentHistory />
        </MemoryRouter>
      );

      // Yuklash indikatori ko'rsatilishini tekshirish
      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      // To'lovlar tarixi yuklangandan keyin ko'rsatilishini tekshirish
      await waitFor(() => {
        expect(screen.getByText('100,000')).toBeInTheDocument();
        expect(screen.getByText('50,000')).toBeInTheDocument();
        expect(screen.getByText('payments.status.completed')).toBeInTheDocument();
        expect(screen.getByText('payments.status.failed')).toBeInTheDocument();
      });
    });
  });
}); 