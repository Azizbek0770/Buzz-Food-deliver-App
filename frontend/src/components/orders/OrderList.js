import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../styles/OrderList.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/');
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Buyurtmalarni yuklashda xatolik yuz berdi');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      confirmed: 'blue',
      preparing: 'purple',
      ready: 'green',
      delivered: 'gray',
      cancelled: 'red',
    };
    return colors[status] || 'black';
  };

  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="orders-list">
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <h3>Buyurtma #{order.id}</h3>
            <span 
              className="order-status"
              style={{ color: getStatusColor(order.status) }}
            >
              {order.status}
            </span>
          </div>
          
          <div className="order-details">
            <p>Restoran: {order.restaurant.name}</p>
            <p>Manzil: {order.delivery_address}</p>
            <p>Sana: {new Date(order.created_at).toLocaleString()}</p>
          </div>
          
          <div className="order-items">
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <span>{item.menu_item.name}</span>
                <span>{item.quantity}x</span>
                <span>${item.price}</span>
              </div>
            ))}
          </div>
          
          <div className="order-footer">
            <span className="order-total">
              Jami: ${order.total_amount}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList; 