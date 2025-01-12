import React from 'react';
import PropTypes from 'prop-types';
import './OrderList.css';

const OrderList = ({ orders, onSelectOrder, onAssignOrder, onCompleteDelivery }) => {
  return (
    <div className="order-list">
      <h2>Buyurtmalar</h2>
      <div className="orders-container">
        {orders.map(order => (
          <div key={order.id} className="order-item">
            <div className="order-info" onClick={() => onSelectOrder(order)}>
              <h3>Buyurtma #{order.id}</h3>
              <p>Manzil: {order.address}</p>
              <p>Holat: {order.status}</p>
              <p>Summa: {order.total_amount} so'm</p>
            </div>
            <div className="order-actions">
              {order.status === 'PENDING' && (
                <button 
                  className="assign-btn"
                  onClick={() => onAssignOrder(order.id)}
                >
                  Qabul qilish
                </button>
              )}
              {order.status === 'DELIVERING' && (
                <button 
                  className="complete-btn"
                  onClick={() => onCompleteDelivery(order.id)}
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

OrderList.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      address: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      total_amount: PropTypes.number.isRequired
    })
  ).isRequired,
  onSelectOrder: PropTypes.func.isRequired,
  onAssignOrder: PropTypes.func.isRequired,
  onCompleteDelivery: PropTypes.func.isRequired
};

export default OrderList; 