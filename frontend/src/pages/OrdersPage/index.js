import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import OrderList from '../../components/orders/OrderList';
import './OrdersPage.css';

const OrdersPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('active');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.message) {
      // Ko'rsatish uchun xabar
    }
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/orders/?status=${activeTab}`);
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Buyurtmalarni yuklashda xatolik yuz berdi');
      setLoading(false);
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>Mening buyurtmalarim</h1>

        <div className="orders-tabs">
          <button
            className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Faol buyurtmalar
          </button>
          <button
            className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Tugatilgan buyurtmalar
          </button>
        </div>

        {loading ? (
          <div className="loading">Yuklanmoqda...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <OrderList orders={orders} />
        )}
      </div>
    </div>
  );
};

export default OrdersPage; 