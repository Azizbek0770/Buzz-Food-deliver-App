import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import './PaymentForm.css';

const PaymentForm = ({ orderId }) => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/payments/', {
        order_id: orderId,
        payment_method: paymentMethod,
      });
      
      clearCart();
      navigate('/profile/orders', { 
        state: { message: 'To\'lov muvaffaqiyatli amalga oshirildi!' }
      });
    } catch (err) {
      setError('To\'lovni amalga oshirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h2>To'lov ma'lumotlari</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="payment-methods">
        <label>
          <input
            type="radio"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Plastik karta
        </label>
        
        <label>
          <input
            type="radio"
            value="cash"
            checked={paymentMethod === 'cash'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Naqd pul
        </label>
      </div>
      
      {paymentMethod === 'card' && (
        <div className="card-details">
          <input
            type="text"
            placeholder="Karta raqami"
            pattern="\d{16}"
            required
          />
          <div className="card-extra">
            <input
              type="text"
              placeholder="MM/YY"
              pattern="\d{2}/\d{2}"
              required
            />
            <input
              type="text"
              placeholder="CVV"
              pattern="\d{3}"
              required
            />
          </div>
        </div>
      )}
      
      <button 
        type="submit" 
        className="submit-button"
        disabled={loading}
      >
        {loading ? 'Yuklanmoqda...' : 'To\'lovni amalga oshirish'}
      </button>
    </form>
  );
};

export default PaymentForm; 