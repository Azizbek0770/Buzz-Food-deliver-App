import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/orderService';
import Spinner from '../components/Spinner';
import './DeliveryPage.css';

const DeliveryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getDeliveryOrders();
      setOrders(response);
    } catch (err) {
      setError('Buyurtmalarni yuklashda xatolik yuz berdi');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await orderAPI.acceptOrder(orderId);
      fetchOrders();
    } catch (err) {
      setError('Buyurtmani qabul qilishda xatolik yuz berdi');
      console.error('Error accepting order:', err);
    }
  };

  const handleStartDelivery = async (orderId) => {
    try {
      await orderAPI.startDelivery(orderId);
      fetchOrders();
    } catch (err) {
      setError('Yetkazib berishni boshlashda xatolik yuz berdi');
      console.error('Error starting delivery:', err);
    }
  };

  const handleCompleteDelivery = async (orderId) => {
    try {
      await orderAPI.completeDelivery(orderId);
      fetchOrders();
    } catch (err) {
      setError('Buyurtmani yakunlashda xatolik yuz berdi');
      console.error('Error completing delivery:', err);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="delivery-page">
      <h1>Buyurtmalar</h1>
      
      <div className="orders-grid">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3>Buyurtma #{order.id}</h3>
              <span className={`status ${order.status}`}>
                {order.status === 'pending' && 'Yangi'}
                {order.status === 'accepted' && 'Qabul qilingan'}
                {order.status === 'on_way' && 'Yo\'lda'}
                {order.status === 'delivered' && 'Yetkazildi'}
              </span>
            </div>

            <div className="order-details">
              <p><strong>Restoran:</strong> {order.restaurant_name}</p>
              <p><strong>Manzil:</strong> {order.delivery_address}</p>
              <p><strong>Telefon:</strong> {order.customer_phone}</p>
              <p><strong>Summa:</strong> {order.total_amount.toLocaleString()} so'm</p>
            </div>

            <div className="order-items">
              <h4>Buyurtma tarkibi:</h4>
              {order.items.map(item => (
                <div key={item.id} className="order-item">
                  <span>{item.name}</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="order-actions">
              {order.status === 'pending' && (
                <button 
                  className="accept-btn"
                  onClick={() => handleAcceptOrder(order.id)}
                >
                  Qabul qilish
                </button>
              )}
              {order.status === 'accepted' && (
                <button 
                  className="start-btn"
                  onClick={() => handleStartDelivery(order.id)}
                >
                  Yo'lga chiqish
                </button>
              )}
              {order.status === 'on_way' && (
                <button 
                  className="complete-btn"
                  onClick={() => handleCompleteDelivery(order.id)}
                >
                  Yetkazildi
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryPage; 