import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import wsService, { MessageTypes } from '../../services/websocket';
import { updateOrderStatus } from '../../store/slices/orderSlice';
import './OrderTracker.css';

const OrderStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  ON_THE_WAY: 'on_the_way',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

const statusTranslations = {
  [OrderStatus.PENDING]: 'Kutilmoqda',
  [OrderStatus.CONFIRMED]: 'Tasdiqlandi',
  [OrderStatus.PREPARING]: 'Tayyorlanmoqda',
  [OrderStatus.ON_THE_WAY]: 'Yo\'lda',
  [OrderStatus.DELIVERED]: 'Yetkazildi',
  [OrderStatus.CANCELLED]: 'Bekor qilindi'
};

const OrderTracker = ({ orderId, initialStatus }) => {
  const dispatch = useDispatch();
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [estimatedTime, setEstimatedTime] = useState(null);

  useEffect(() => {
    // WebSocket orqali buyurtma holatini kuzatish
    const unsubscribe = wsService.subscribe(MessageTypes.ORDER_STATUS, (data) => {
      if (data.orderId === orderId) {
        setCurrentStatus(data.status);
        setEstimatedTime(data.estimatedTime);
        dispatch(updateOrderStatus({ orderId, status: data.status }));
      }
    });

    return () => unsubscribe();
  }, [orderId, dispatch]);

  const getStatusPercentage = () => {
    const statuses = Object.values(OrderStatus);
    const currentIndex = statuses.indexOf(currentStatus);
    if (currentIndex === -1) return 0;
    return (currentIndex / (statuses.length - 2)) * 100; // -2 because we exclude CANCELLED
  };

  return (
    <div className="order-tracker">
      <div className="status-bar">
        <div 
          className="status-progress"
          style={{ width: `${getStatusPercentage()}%` }}
        />
      </div>

      <div className="status-steps">
        {Object.values(OrderStatus)
          .filter(status => status !== OrderStatus.CANCELLED)
          .map((status, index) => (
            <div 
              key={status}
              className={`status-step ${
                currentStatus === status ? 'active' : ''
              } ${
                getStatusPercentage() >= (index / 4) * 100 ? 'completed' : ''
              }`}
            >
              <div className="step-icon" />
              <span className="step-label">{statusTranslations[status]}</span>
            </div>
          ))}
      </div>

      {estimatedTime && currentStatus !== OrderStatus.DELIVERED && (
        <div className="estimated-time">
          <p>Taxminiy yetkazib berish vaqti: {estimatedTime}</p>
        </div>
      )}

      {currentStatus === OrderStatus.CANCELLED && (
        <div className="cancelled-status">
          <p>Buyurtma bekor qilindi</p>
        </div>
      )}
    </div>
  );
};

OrderTracker.propTypes = {
  orderId: PropTypes.string.isRequired,
  initialStatus: PropTypes.oneOf(Object.values(OrderStatus)).isRequired
};

export default OrderTracker; 