import { store } from '../store';
import { addNotification } from '../store/slices/uiSlice';
import { updateOrder } from '../store/slices/orderSlice';
import { wsConnected, wsDisconnected, wsReconnecting, wsError } from '../store/slices/websocketSlice';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.subscribers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = null;
  }

  connect(token) {
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws';
    
    this.ws = new WebSocket(`${wsUrl}?token=${token}`);

    this.ws.onopen = () => {
      console.log('WebSocket ulanish o\'rnatildi');
      this.reconnectAttempts = 0;
      store.dispatch(wsConnected());
    };

    this.ws.onclose = () => {
      console.log('WebSocket ulanish uzildi');
      store.dispatch(wsDisconnected());
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket xatosi:', error);
      store.dispatch(wsError(error.message));
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(event.data);
    };
  }

  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('WebSocket qayta ulanish chegarasiga yetdi');
      return;
    }

    this.reconnectAttempts++;
    store.dispatch(wsReconnecting());
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      const token = store.getState().auth.token;
      if (token) {
        this.connect(token);
      }
    }, 3000 * this.reconnectAttempts);
  }

  subscribe(type, callback) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type).add(callback);
  }

  unsubscribe(type, callback) {
    if (this.subscribers.has(type)) {
      this.subscribers.get(type).delete(callback);
    }
  }

  handleMessage(data) {
    try {
      const message = JSON.parse(data);
      const { type, payload } = message;

      // Xabar turiga qarab tegishli amallarni bajarish
      switch (type) {
        case MessageTypes.NEW_ORDER:
          store.dispatch(addNotification({
            type: 'info',
            message: 'Yangi buyurtma keldi'
          }));
          break;

        case MessageTypes.ORDER_STATUS_UPDATED:
          store.dispatch(updateOrder(payload));
          store.dispatch(addNotification({
            type: 'info',
            message: `Buyurtma #${payload.id} holati yangilandi: ${payload.status}`
          }));
          break;

        case MessageTypes.CHAT_MESSAGE:
          // Chat xabarlarini qayta ishlash
          break;

        case MessageTypes.DELIVERY_LOCATION_UPDATED:
          // Yetkazib beruvchi lokatsiyasini yangilash
          break;

        case MessageTypes.NOTIFICATION:
          store.dispatch(addNotification(payload));
          break;
      }

      // Obunachilarga xabarni yuborish
      if (this.subscribers.has(type)) {
        this.subscribers.get(type).forEach(callback => {
          callback(payload);
        });
      }
    } catch (error) {
      console.error('Xabarni qayta ishlashda xatolik:', error);
    }
  }

  sendMessage(type, data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    } else {
      console.error('WebSocket ulanish mavjud emas');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers.clear();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    store.dispatch(wsDisconnected());
  }
}

export const MessageTypes = {
  NEW_ORDER: 'NEW_ORDER',
  ORDER_STATUS_UPDATED: 'ORDER_STATUS_UPDATED',
  CHAT_MESSAGE: 'CHAT_MESSAGE',
  DELIVERY_LOCATION_UPDATED: 'DELIVERY_LOCATION_UPDATED',
  NOTIFICATION: 'NOTIFICATION'
};

const wsService = new WebSocketService();
export default wsService; 