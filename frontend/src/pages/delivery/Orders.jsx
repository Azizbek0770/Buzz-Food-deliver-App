import React, { useState, useEffect } from 'react';
import orderService from '../../services/api/order.service';
import OrderList from '../../components/delivery/OrderList';
import OrderDetails from '../../components/delivery/OrderDetails';
import Modal from '../../components/common/Modal';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAvailableOrders();
      setOrders(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignOrder = async (orderId) => {
    try {
      await orderService.assignOrder(orderId);
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompleteDelivery = async (orderId, deliveryData) => {
    try {
      await orderService.completeDelivery(orderId, deliveryData);
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="delivery-orders">
      <h2>Mavjud buyurtmalar</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Yuklanmoqda...</div>
      ) : (
        <OrderList
          orders={orders}
          onAssignOrder={handleAssignOrder}
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
            onAssign={() => handleAssignOrder(selectedOrder.id)}
            onComplete={(data) => handleCompleteDelivery(selectedOrder.id, data)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Orders; 