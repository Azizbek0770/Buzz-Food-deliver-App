import React from 'react';
import PropTypes from 'prop-types';
import './OrderList.css';

const OrderList = ({ orders, onSelectOrder, onAcceptOrder, onRejectOrder, onSetOrderReady }) => {
  return (
    <div className="order-list">
      <h2>Buyurtmalar</h2>
      <div className="orders-container">
        {orders.map(order => (
          <div key={order.id} className="order-item">
            <div className="order-info" onClick={() => onSelectOrder(order)}>
              <h3>Buyurtma #{order.id}</h3>
              <p>Mijoz: {order.customer_name}</p>
              <p>Holat: {order.status}</p>
              <p>Summa: {order.total_amount} so'm</p>
              <p>Vaqt: {new Date(order.created_at).toLocaleString()}</p>
            </div>
            <div className="order-actions">
              {order.status === 'PENDING' && (
                <>
                  <button 
                    className="accept-btn"
                    onClick={() => onAcceptOrder(order.id)}
                  >
                    Qabul qilish
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => onRejectOrder(order.id)}
                  >
                    Rad etish
                  </button>
                </>
              )}
              {order.status === 'ACCEPTED' && (
                <button 
                  className="ready-btn"
                  onClick={() => onSetOrderReady(order.id)}
                >
                  Tayyor
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
      customer_name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      total_amount: PropTypes.number.isRequired,
      created_at: PropTypes.string.isRequired
    })
  ).isRequired,
  onSelectOrder: PropTypes.func.isRequired,
  onAcceptOrder: PropTypes.func.isRequired,
  onRejectOrder: PropTypes.func.isRequired,
  onSetOrderReady: PropTypes.func.isRequired
};

export default OrderList; 