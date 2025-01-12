import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import orderService from '../../services/order.service';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails';
import Modal from '../common/Modal';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const userId = useSelector(state => state.auth.user?.id);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getAvailableOrders();
      setOrders(response.data);
    } catch (err) {
      setError(err.message || 'Buyurtmalarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleAssignOrder = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      await orderService.assignOrder(orderId, userId);
      await fetchOrders();
    } catch (err) {
      setError(err.message || 'Buyurtmani qabul qilishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDelivery = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      await orderService.completeDelivery(orderId);
      await fetchOrders();
    } catch (err) {
      setError(err.message || 'Buyurtmani yakunlashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
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
        onSelectOrder={handleSelectOrder}
        onAssignOrder={handleAssignOrder}
        onCompleteDelivery={handleCompleteDelivery}
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