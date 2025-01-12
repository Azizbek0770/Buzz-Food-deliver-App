import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import orderService from '../../services/api/order.service';
import { selectRestaurantId } from '../../store/slices/authSlice';
import OrderList from '../../components/restaurant/OrderList';
import OrderDetails from '../../components/restaurant/OrderDetails';
import Modal from '../../components/common/Modal';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const restaurantId = useSelector(selectRestaurantId);

  useEffect(() => {
    fetchOrders();
  }, [restaurantId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getRestaurantOrders(restaurantId);
      setOrders(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await orderService.acceptOrder(orderId);
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRejectOrder = async (orderId, reason) => {
    try {
      await orderService.rejectOrder(orderId, reason);
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSetOrderReady = async (orderId) => {
    try {
      await orderService.setOrderReady(orderId);
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="restaurant-orders">
      <h2>Buyurtmalar</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Yuklanmoqda...</div>
      ) : (
        <OrderList
          orders={orders}
          onAcceptOrder={handleAcceptOrder}
          onRejectOrder={handleRejectOrder}
          onSetOrderReady={handleSetOrderReady}
          onSelectOrder={setSelectedOrder}
        />
      )}

      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title="Buyurtma tafsilotlari"
      >
        {selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            onAccept={() => handleAcceptOrder(selectedOrder.id)}
            onReject={(reason) => handleRejectOrder(selectedOrder.id, reason)}
            onSetReady={() => handleSetOrderReady(selectedOrder.id)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Orders; 