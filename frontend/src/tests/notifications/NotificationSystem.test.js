import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockWebSocketEvent, mockAuthState } from '../../utils/test-utils';
import NotificationSystem from '../../components/notifications/NotificationSystem';

describe('NotificationSystem Component', () => {
  beforeEach(() => {
    // Audio mock
    window.HTMLMediaElement.prototype.play = jest.fn();
  });

  test('renders notification system', () => {
    render(<NotificationSystem />, { preloadedState: mockAuthState });
    expect(screen.getByTestId('notification-system')).toBeInTheDocument();
  });

  test('shows new notification via WebSocket', async () => {
    render(<NotificationSystem />, { preloadedState: mockAuthState });
    
    const notification = {
      id: 1,
      type: 'info',
      message: 'Yangi bildirishnoma',
      createdAt: new Date().toISOString()
    };
    
    const wsEvent = mockWebSocketEvent('NEW_NOTIFICATION', notification);
    window.dispatchEvent(wsEvent);

    expect(await screen.findByText('Yangi bildirishnoma')).toBeInTheDocument();
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  test('removes notification after timeout', async () => {
    render(<NotificationSystem />, { preloadedState: mockAuthState });
    
    const notification = {
      id: 1,
      type: 'success',
      message: 'Vaqtinchalik bildirishnoma',
      createdAt: new Date().toISOString()
    };
    
    const wsEvent = mockWebSocketEvent('NEW_NOTIFICATION', notification);
    window.dispatchEvent(wsEvent);

    expect(await screen.findByText('Vaqtinchalik bildirishnoma')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Vaqtinchalik bildirishnoma')).not.toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('handles different notification types', async () => {
    render(<NotificationSystem />, { preloadedState: mockAuthState });
    
    const notifications = [
      {
        id: 1,
        type: 'success',
        message: 'Muvaffaqiyatli',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        type: 'error',
        message: 'Xatolik',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        type: 'warning',
        message: 'Ogohlantirish',
        createdAt: new Date().toISOString()
      }
    ];
    
    notifications.forEach(notification => {
      const wsEvent = mockWebSocketEvent('NEW_NOTIFICATION', notification);
      window.dispatchEvent(wsEvent);
    });

    await waitFor(() => {
      expect(screen.getByText('Muvaffaqiyatli')).toBeInTheDocument();
      expect(screen.getByText('Xatolik')).toBeInTheDocument();
      expect(screen.getByText('Ogohlantirish')).toBeInTheDocument();
    });
  });

  test('allows manual notification dismissal', async () => {
    render(<NotificationSystem />, { preloadedState: mockAuthState });
    
    const notification = {
      id: 1,
      type: 'info',
      message: 'O\'chirish mumkin',
      createdAt: new Date().toISOString()
    };
    
    const wsEvent = mockWebSocketEvent('NEW_NOTIFICATION', notification);
    window.dispatchEvent(wsEvent);

    const notificationElement = await screen.findByText('O\'chirish mumkin');
    const closeButton = notificationElement.parentElement.querySelector('[aria-label="close"]');
    
    fireEvent.click(closeButton);
    
    expect(screen.queryByText('O\'chirish mumkin')).not.toBeInTheDocument();
  });

  test('handles multiple notifications stacking', async () => {
    render(<NotificationSystem />, { preloadedState: mockAuthState });
    
    const notifications = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      type: 'info',
      message: `Bildirishnoma ${i + 1}`,
      createdAt: new Date().toISOString()
    }));
    
    notifications.forEach(notification => {
      const wsEvent = mockWebSocketEvent('NEW_NOTIFICATION', notification);
      window.dispatchEvent(wsEvent);
    });

    await waitFor(() => {
      const notificationElements = screen.getAllByTestId('notification');
      expect(notificationElements.length).toBeLessThanOrEqual(3);
    });
  });

  test('updates notification badge count', async () => {
    const { store } = render(<NotificationSystem />, { preloadedState: mockAuthState });
    
    const notifications = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      type: 'info',
      message: `Bildirishnoma ${i + 1}`,
      createdAt: new Date().toISOString()
    }));
    
    notifications.forEach(notification => {
      const wsEvent = mockWebSocketEvent('NEW_NOTIFICATION', notification);
      window.dispatchEvent(wsEvent);
    });

    await waitFor(() => {
      const state = store.getState();
      expect(state.notifications.unreadCount).toBe(3);
    });
  });
}); 