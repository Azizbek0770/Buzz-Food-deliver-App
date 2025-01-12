import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import wsService, { MessageTypes } from '../../services/websocket';
import './ChatWindow.css';

const ChatWindow = ({ orderId, recipientId, recipientName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const currentUser = useSelector(state => state.auth.user);

  useEffect(() => {
    // Xabarlarni yuklash
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/chat/${orderId}/messages`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Xabarlarni yuklashda xatolik:', error);
      }
    };

    loadMessages();

    // WebSocket orqali yangi xabarlarni kuzatish
    const unsubscribe = wsService.subscribe(MessageTypes.CHAT_MESSAGE, (data) => {
      if (data.orderId === orderId) {
        setMessages(prev => [...prev, data]);
        scrollToBottom();
      }
    });

    return () => unsubscribe();
  }, [orderId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      orderId,
      recipientId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    wsService.sendMessage(MessageTypes.CHAT_MESSAGE, messageData);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>{recipientName}</h3>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.senderId === currentUser.id ? 'sent' : 'received'
            }`}
          >
            <div className="message-content">
              <p>{message.content}</p>
              <span className="message-time">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input" onSubmit={handleSend}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Xabar yozing..."
        />
        <button type="submit" disabled={!newMessage.trim()}>
          Yuborish
        </button>
      </form>
    </div>
  );
};

ChatWindow.propTypes = {
  orderId: PropTypes.string.isRequired,
  recipientId: PropTypes.string.isRequired,
  recipientName: PropTypes.string.isRequired
};

export default ChatWindow; 