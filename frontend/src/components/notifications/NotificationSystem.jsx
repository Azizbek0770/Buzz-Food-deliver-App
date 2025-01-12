import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import wsService, { MessageTypes } from '../../services/websocket';
import { addNotification } from '../../store/slices/notificationSlice';
import './NotificationSystem.css';

const NotificationType = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

const NotificationSystem = () => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [sound] = useState(new Audio('/notification-sound.mp3'));

  useEffect(() => {
    const unsubscribe = wsService.subscribe(MessageTypes.NOTIFICATION, (data) => {
      const notification = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString()
      };

      setNotifications(prev => [notification, ...prev]);
      dispatch(addNotification(notification));

      if (data.playSound !== false) {
        sound.play().catch(error => console.error('Notification sound error:', error));
      }

      if (data.type !== NotificationType.ERROR) {
        setTimeout(() => {
          removeNotification(notification.id);
        }, 5000);
      }
    });

    return () => unsubscribe();
  }, [dispatch, sound]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return '✓';
      case NotificationType.WARNING:
        return '⚠';
      case NotificationType.ERROR:
        return '✕';
      default:
        return 'ℹ';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="notification-system">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification ${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="notification-icon">
            {getIcon(notification.type)}
          </div>
          
          <div className="notification-content">
            {notification.title && (
              <h4 className="notification-title">{notification.title}</h4>
            )}
            <p className="notification-message">{notification.message}</p>
            <span className="notification-time">
              {formatTime(notification.createdAt)}
            </span>
          </div>

          <button
            className="notification-close"
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(notification.id);
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem; 