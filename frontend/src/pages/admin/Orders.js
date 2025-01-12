import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Orders.css';

const AdminOrders = () => {
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

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/`, { status });
      fetchOrders(); // Yangilangan ma'lumotlarni olish
    } catch (err) {
      setError('Buyurtma holatini yangilashda xatolik yuz berdi');
    }
  };

  if (loading) return <div className="loading">Yuklanmoqda...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-orders">
      <h1>Buyurtmalar boshqaruvi</h1>
      
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mijoz</th>
              <th>Restoran</th>
              <th>Summa</th>
              <th>Holat</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.user.name}</td>
                <td>{order.restaurant.name}</td>
                <td>{order.total_amount} so'm</td>
                <td>
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  >
                    <option value="pending">Kutilmoqda</option>
                    <option value="confirmed">Tasdiqlandi</option>
                    <option value="preparing">Tayyorlanmoqda</option>
                    <option value="ready">Tayyor</option>
                    <option value="delivering">Yetkazilmoqda</option>
                    <option value="delivered">Yetkazildi</option>
                    <option value="cancelled">Bekor qilindi</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders; 