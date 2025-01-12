import React from 'react';
import PropTypes from 'prop-types';
import './OrdersList.css';

const OrdersList = ({ orders, onAcceptOrder, onRejectOrder, onSetOrderReady }) => {
  return (
    <div className="dashboard-orders">
      <h3>So'nggi buyurtmalar</h3>
      
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-item">
            <div className="order-header">
              <span className="order-id">#{order.id}</span>
              <span className={`order-status status-${order.status}`}>
                {order.status}
              </span>
            </div>
            
            <div className="order-details">
              <div className="customer-info">
                <strong>{order.customer.name}</strong>
                <span>{order.customer.phone}</span>
              </div>
              
              <div className="order-items">
                {order.items.map(item => (
                  <div key={item.id} className="item">
                    {item.quantity}x {item.name}
                  </div>
                ))}
              </div>
              
              <div className="order-total">
                Jami: {order.total.toLocaleString()} so'm
              </div>
            </div>
            
            <div className="order-actions">
              {order.status === 'PENDING' && (
                <>
                  <button
                    className="btn-accept"
                    onClick={() => onAcceptOrder(order.id)}
                  >
                    Qabul qilish
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => onRejectOrder(order.id)}
                  >
                    Rad etish
                  </button>
                </>
              )}
              
              {order.status === 'PREPARING' && (
                <button
                  className="btn-ready"
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

OrdersList.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      customer: PropTypes.shape({
        name: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired
      }).isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          quantity: PropTypes.number.isRequired
        })
      ).isRequired,
      total: PropTypes.number.isRequired
    })
  ).isRequired,
  onAcceptOrder: PropTypes.func.isRequired,
  onRejectOrder: PropTypes.func.isRequired,
  onSetOrderReady: PropTypes.func.isRequired
};

export default OrdersList; 