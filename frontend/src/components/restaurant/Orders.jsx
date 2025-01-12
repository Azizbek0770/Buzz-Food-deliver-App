import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectRestaurantId } from '../../store/slices/authSlice';
import orderService from '../../services/order.service';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails';
import Modal from '../common/Modal';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const restaurantId = useSelector(selectRestaurantId);

  useEffect(() => {
    fetchOrders();
  }, [restaurantId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getRestaurantOrders(restaurantId);
      setOrders(response.data);
    } catch (err) {
      setError('Buyurtmalarni yuklashda xatolik yuz berdi');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await orderService.acceptOrder(orderId);
      await fetchOrders();
    } catch (err) {
      setError('Buyurtmani qabul qilishda xatolik yuz berdi');
      console.error('Error accepting order:', err);
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      await orderService.rejectOrder(orderId);
      await fetchOrders();
    } catch (err) {
      setError('Buyurtmani rad etishda xatolik yuz berdi');
      console.error('Error rejecting order:', err);
    }
  };

  const handleSetOrderReady = async (orderId) => {
    try {
      await orderService.setOrderReady(orderId);
      await fetchOrders();
    } catch (err) {
      setError('Buyurtma holatini o'zgartirishda xatolik yuz berdi');
      console.error('Error setting order ready:', err);
    }
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading">Yuklanmoqda...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="orders-page">
      <OrderList
        orders={orders}
        onAcceptOrder={handleAcceptOrder}
        onRejectOrder={handleRejectOrder}
        onSetOrderReady={handleSetOrderReady}
        onSelectOrder={handleSelectOrder}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Buyurtma tafsilotlari"
      >
        <OrderDetails order={selectedOrder} />
      </Modal>
    </div>
  );
};

export default Orders; 