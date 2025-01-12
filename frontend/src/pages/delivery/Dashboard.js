import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import './Dashboard.css';

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Har 30 sekundda yangilash
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/delivery/');
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Buyurtmalarni yuklashda xatolik yuz berdi');
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await api.post(`/orders/${orderId}/accept/`);
      fetchOrders();
    } catch (err) {
      setError('Buyurtmani qabul qilishda xatolik yuz berdi');
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await api.post(`/orders/${orderId}/complete/`);
      fetchOrders();
    } catch (err) {
      setError('Buyurtmani yakunlashda xatolik yuz berdi');
    }
  };

  if (loading) return <div className="loading">Yuklanmoqda...</div>;
  if (error) return <div className="error">{error}</div>;

  const availableOrders = orders.filter(order => order.status === 'ready');
  const myOrders = orders.filter(order => 
    order.status === 'delivering' && order.delivery_info?.id === activeOrder?.id
  );

  return (
    <div className="delivery-dashboard">
      <div className="dashboard-header">
        <h1>Yetkazib beruvchi paneli</h1>
        {activeOrder && (
          <div className="active-status">
            <span className="status active">Faol</span>
          </div>
        )}
      </div>

      {myOrders.length > 0 && (
        <div className="my-orders">
          <h2>Mening buyurtmalarim</h2>
          {myOrders.map(order => (
            <div key={order.id} className="order-card active">
              <div className="order-info">
                <h3>Buyurtma #{order.id}</h3>
                <p className="restaurant">{order.restaurant.name}</p>
                <p className="address">
                  <i className="fas fa-map-marker-alt"></i>
                  {order.delivery_address}
                </p>
                <p className="customer">
                  <i className="fas fa-user"></i>
                  {order.user.name} - {order.user.phone}
                </p>
              </div>
              <div className="order-actions">
                <Button
                  variant="primary"
                  onClick={() => handleCompleteOrder(order.id)}
                >
                  Yakunlash
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="available-orders">
        <h2>Mavjud buyurtmalar</h2>
        {availableOrders.length === 0 ? (
          <p className="no-orders">Hozircha buyurtmalar yo'q</p>
        ) : (
          availableOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-info">
                <h3>Buyurtma #{order.id}</h3>
                <p className="restaurant">{order.restaurant.name}</p>
                <p className="address">
                  <i className="fas fa-map-marker-alt"></i>
                  {order.delivery_address}
                </p>
                <div className="order-meta">
                  <span className="distance">
                    <i className="fas fa-route"></i>
                    {order.distance || '3.5'} km
                  </span>
                  <span className="price">
                    <i className="fas fa-money-bill-wave"></i>
                    {order.delivery_fee || '10,000'} so'm
                  </span>
                </div>
              </div>
              <div className="order-actions">
                <Button
                  variant="primary"
                  onClick={() => handleAcceptOrder(order.id)}
                >
                  Qabul qilish
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard; 