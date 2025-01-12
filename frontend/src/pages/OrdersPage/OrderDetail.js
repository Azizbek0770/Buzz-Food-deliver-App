import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/common/Button';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/${id}/`);
      setOrder(response.data);
      setLoading(false);
    } catch (err) {
      setError('Buyurtma ma\'lumotlarini yuklashda xatolik yuz berdi');
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await api.post(`/orders/${id}/cancel/`);
      fetchOrderDetails();
    } catch (err) {
      setError('Buyurtmani bekor qilishda xatolik yuz berdi');
    }
  };

  if (loading) return <div className="loading">Yuklanmoqda...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="error">Buyurtma topilmadi</div>;

  return (
    <div className="order-detail">
      <div className="order-header">
        <h1>Buyurtma #{order.id}</h1>
        <span className={`status ${order.status}`}>
          {order.status}
        </span>
      </div>

      <div className="order-info">
        <div className="info-section">
          <h2>Restoran ma'lumotlari</h2>
          <p>{order.restaurant.name}</p>
          <p>{order.restaurant.address}</p>
          <p>{order.restaurant.phone_number}</p>
        </div>

        <div className="info-section">
          <h2>Yetkazib berish ma'lumotlari</h2>
          <p>{order.delivery_address}</p>
          <p>Telefon: {order.user.phone}</p>
          {order.notes && <p>Izoh: {order.notes}</p>}
        </div>
      </div>

      <div className="order-items">
        <h2>Buyurtma tarkibi</h2>
        <div className="items-list">
          {order.items.map(item => (
            <div key={item.id} className="order-item">
              <div className="item-info">
                <h3>{item.menu_item.name}</h3>
                <p>{item.quantity} x {item.price} so'm</p>
              </div>
              <span className="item-total">
                {item.quantity * item.price} so'm
              </span>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <div className="summary-item">
            <span>Mahsulotlar narxi:</span>
            <span>{order.total_amount} so'm</span>
          </div>
          <div className="summary-item">
            <span>Yetkazib berish:</span>
            <span>10,000 so'm</span>
          </div>
          <div className="summary-item total">
            <span>Jami:</span>
            <span>{order.total_amount + 10000} so'm</span>
          </div>
        </div>
      </div>

      {order.status === 'pending' && (
        <div className="order-actions">
          <Button
            variant="danger"
            onClick={handleCancelOrder}
          >
            Bekor qilish
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderDetail; 