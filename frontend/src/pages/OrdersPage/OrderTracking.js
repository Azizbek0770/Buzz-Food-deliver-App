import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import './OrderTracking.css';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderStatus();
    const interval = setInterval(fetchOrderStatus, 30000); // Har 30 sekundda yangilash
    return () => clearInterval(interval);
  }, [id]);

  const fetchOrderStatus = async () => {
    try {
      const response = await api.get(`/orders/${id}/`);
      setOrder(response.data);
      setLoading(false);
    } catch (err) {
      setError('Buyurtma holatini yuklashda xatolik yuz berdi');
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'delivering',
      'delivered'
    ];
    return steps.indexOf(status);
  };

  if (loading) return <div className="loading">Yuklanmoqda...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="error">Buyurtma topilmadi</div>;

  const currentStep = getStatusStep(order.status);

  return (
    <div className="order-tracking">
      <div className="tracking-header">
        <h1>Buyurtma #{order.id} holati</h1>
        <p>Restoran: {order.restaurant.name}</p>
      </div>

      <div className="tracking-timeline">
        <div className="timeline-step">
          <div className={`step-icon ${currentStep >= 0 ? 'active' : ''}`}>
            <i className="fas fa-clock"></i>
          </div>
          <div className="step-content">
            <h3>Kutilmoqda</h3>
            <p>Buyurtmangiz restoran tomonidan tasdiqlanishi kutilmoqda</p>
          </div>
        </div>

        <div className="timeline-step">
          <div className={`step-icon ${currentStep >= 1 ? 'active' : ''}`}>
            <i className="fas fa-check"></i>
          </div>
          <div className="step-content">
            <h3>Tasdiqlandi</h3>
            <p>Buyurtmangiz restoran tomonidan tasdiqlandi</p>
          </div>
        </div>

        <div className="timeline-step">
          <div className={`step-icon ${currentStep >= 2 ? 'active' : ''}`}>
            <i className="fas fa-utensils"></i>
          </div>
          <div className="step-content">
            <h3>Tayyorlanmoqda</h3>
            <p>Buyurtmangiz tayyorlanmoqda</p>
          </div>
        </div>

        <div className="timeline-step">
          <div className={`step-icon ${currentStep >= 3 ? 'active' : ''}`}>
            <i className="fas fa-box"></i>
          </div>
          <div className="step-content">
            <h3>Tayyor</h3>
            <p>Buyurtmangiz yetkazib berish uchun tayyor</p>
          </div>
        </div>

        <div className="timeline-step">
          <div className={`step-icon ${currentStep >= 4 ? 'active' : ''}`}>
            <i className="fas fa-motorcycle"></i>
          </div>
          <div className="step-content">
            <h3>Yetkazilmoqda</h3>
            <p>Buyurtmangiz yetkazib berilmoqda</p>
          </div>
        </div>

        <div className="timeline-step">
          <div className={`step-icon ${currentStep >= 5 ? 'active' : ''}`}>
            <i className="fas fa-flag-checkered"></i>
          </div>
          <div className="step-content">
            <h3>Yetkazildi</h3>
            <p>Buyurtmangiz yetkazib berildi</p>
          </div>
        </div>
      </div>

      {order.status === 'delivering' && order.delivery_info && (
        <div className="delivery-info">
          <h2>Yetkazib beruvchi ma'lumotlari</h2>
          <p>
            <i className="fas fa-user"></i>
            {order.delivery_info.name}
          </p>
          <p>
            <i className="fas fa-phone"></i>
            {order.delivery_info.phone}
          </p>
        </div>
      )}

      <div className="estimated-time">
        <h2>Taxminiy yetkazib berish vaqti</h2>
        <p>{order.estimated_delivery_time || '30-45 daqiqa'}</p>
      </div>
    </div>
  );
};

export default OrderTracking; 