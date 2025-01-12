import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './PaymentForm.css';

const PaymentForm = ({ order, onPaymentComplete }) => {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const paymentMethods = [
    { id: 'payme', name: 'Payme', icon: '/images/payme-logo.png' },
    { id: 'click', name: 'Click', icon: '/images/click-logo.png' },
    { id: 'cash', name: t('payment.cash'), icon: '/images/cash-icon.png' },
    { id: 'terminal', name: t('payment.terminal'), icon: '/images/terminal-icon.png' }
  ];

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setError(null);
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError(t('payment.selectMethod'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (selectedMethod === 'payme') {
        // Payme to'lov tizimiga o'tish
        const paymeUrl = `https://checkout.paycom.uz/${process.env.REACT_APP_PAYME_MERCHANT_ID}`;
        const params = new URLSearchParams({
          m: process.env.REACT_APP_PAYME_MERCHANT_ID,
          ac: JSON.stringify({
            order_id: order.id,
          }),
          a: Math.floor(order.total_amount * 100), // Tiyinda
          l: 'uz',
          c: 'https://your-site.uz/payment/success',
          cl: 'https://your-site.uz/payment/cancel'
        });

        window.location.href = `${paymeUrl}?${params.toString()}`;
      } else if (selectedMethod === 'cash') {
        // Naqd to'lov
        await handleCashPayment();
      } else if (selectedMethod === 'terminal') {
        // Terminal orqali to'lov
        await handleTerminalPayment();
      }

      onPaymentComplete();
    } catch (err) {
      setError(t('payment.error'));
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCashPayment = async () => {
    // Naqd to'lov logikasi
  };

  const handleTerminalPayment = async () => {
    // Terminal to'lov logikasi
  };

  return (
    <div className="payment-form">
      <h2>{t('payment.selectPaymentMethod')}</h2>
      
      <div className="payment-methods">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-method ${selectedMethod === method.id ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodSelect(method.id)}
          >
            <img src={method.icon} alt={method.name} />
            <span>{method.name}</span>
          </div>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="order-summary">
        <h3>{t('payment.orderSummary')}</h3>
        <div className="order-details">
          <p>{t('payment.orderNumber')}: {order.id}</p>
          <p>{t('payment.totalAmount')}: {order.total_amount.toLocaleString()} {t('common.currency')}</p>
        </div>
      </div>

      <button
        className="pay-button"
        onClick={handlePayment}
        disabled={loading || !selectedMethod}
      >
        {loading ? t('common.loading') : t('payment.pay')}
      </button>
    </div>
  );
};

PaymentForm.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    total_amount: PropTypes.number.isRequired
  }).isRequired,
  onPaymentComplete: PropTypes.func.isRequired
};

export default PaymentForm; 