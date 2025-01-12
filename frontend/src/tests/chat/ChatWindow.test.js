import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockWebSocketEvent, mockAuthState } from '../../utils/test-utils';
import ChatWindow from '../../components/chat/ChatWindow';

describe('ChatWindow Component', () => {
  const mockMessages = [
    { id: 1, text: 'Salom', sender: 'user', createdAt: '2024-01-11T12:00:00Z' },
    { id: 2, text: 'Yaxshimisiz', sender: 'admin', createdAt: '2024-01-11T12:01:00Z' }
  ];

  beforeEach(() => {
    localStorage.setItem('messages', JSON.stringify(mockMessages));
  });

  test('renders chat window with messages', () => {
    render(<ChatWindow orderId="123" />, { preloadedState: mockAuthState });
    
    expect(screen.getByText('Salom')).toBeInTheDocument();
    expect(screen.getByText('Yaxshimisiz')).toBeInTheDocument();
  });

  test('sends new message', async () => {
    const { store } = render(<ChatWindow orderId="123" />, { preloadedState: mockAuthState });
    
    const input = screen.getByPlaceholderText(/xabar yozing/i);
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    const sendButton = screen.getByRole('button', { name: /yuborish/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(input.value).toBe('');
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
  });

  test('handles incoming messages via WebSocket', async () => {
    render(<ChatWindow orderId="123" />, { preloadedState: mockAuthState });
    
    // WebSocket orqali yangi xabar kelishi
    const newMessage = {
      id: 3,
      text: 'Yangi xabar',
      sender: 'admin',
      createdAt: new Date().toISOString()
    };
    
    const wsEvent = mockWebSocketEvent('NEW_MESSAGE', newMessage);
    window.dispatchEvent(wsEvent);

    expect(await screen.findByText('Yangi xabar')).toBeInTheDocument();
  });

  test('shows typing indicator', async () => {
    render(<ChatWindow orderId="123" />, { preloadedState: mockAuthState });
    
    // WebSocket orqali yozish holati kelishi
    const typingEvent = mockWebSocketEvent('TYPING', {
      orderId: '123',
      user: 'admin'
    });
    window.dispatchEvent(typingEvent);

    expect(await screen.findByText(/admin yozmoqda/i)).toBeInTheDocument();
    
    // Typing indicator yo'qolishi kerak
    await waitFor(() => {
      expect(screen.queryByText(/admin yozmoqda/i)).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('loads previous messages on scroll', async () => {
    render(<ChatWindow orderId="123" />, { preloadedState: mockAuthState });
    
    const chatContainer = screen.getByTestId('chat-messages');
    fireEvent.scroll(chatContainer, { target: { scrollTop: 0 } });

    await waitFor(() => {
      const messages = screen.getAllByTestId('chat-message');
      expect(messages.length).toBeGreaterThan(2);
    });
  });

  test('handles message send failure', async () => {
    render(<ChatWindow orderId="123" />, { preloadedState: mockAuthState });
    
    // WebSocket ulanishini o'chirish
    window.WebSocket.prototype.send = jest.fn(() => {
      throw new Error('Failed to send');
    });
    
    const input = screen.getByPlaceholderText(/xabar yozing/i);
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    const sendButton = screen.getByRole('button', { name: /yuborish/i });
    fireEvent.click(sendButton);

    expect(await screen.findByText(/xabar yuborishda xatolik/i)).toBeInTheDocument();
  });

  test('reconnects WebSocket on connection loss', async () => {
    render(<ChatWindow orderId="123" />, { preloadedState: mockAuthState });
    
    // WebSocket ulanishini uzish
    window.WebSocket.prototype.close.call(window.WebSocket);
    
    // Qayta ulanish xabari
    expect(await screen.findByText(/qayta ulanilmoqda/i)).toBeInTheDocument();
    
    // Muvaffaqiyatli ulangandan so'ng
    await waitFor(() => {
      expect(screen.queryByText(/qayta ulanilmoqda/i)).not.toBeInTheDocument();
    });
  });
}); 