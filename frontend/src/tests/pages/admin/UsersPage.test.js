import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockAuthState } from '../../../utils/test-utils';
import UsersPage from '../../../pages/admin/UsersPage';
import { server } from '../../../mocks/server';
import { rest } from 'msw';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

describe('UsersPage', () => {
  const mockUsers = {
    results: [
      {
        id: 1,
        firstName: 'Test',
        lastName: 'User 1',
        email: 'test1@example.com',
        phone: '+998901234567',
        role: 'customer',
        isActive: true,
        createdAt: '2024-01-11T12:00:00Z'
      },
      {
        id: 2,
        firstName: 'Test',
        lastName: 'User 2',
        email: 'test2@example.com',
        phone: '+998907654321',
        role: 'admin',
        isActive: true,
        createdAt: '2024-01-11T11:00:00Z'
      }
    ],
    count: 2
  };

  beforeEach(() => {
    server.use(
      rest.get(`${API_URL}/admin/users/`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockUsers));
      })
    );
  });

  test('renders users list', async () => {
    render(<UsersPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText('Test User 1')).toBeInTheDocument();
    expect(screen.getByText('Test User 2')).toBeInTheDocument();
  });

  test('shows user details', async () => {
    render(<UsersPage />, { preloadedState: mockAuthState });
    
    const viewButton = await screen.findByTestId('view-user-1');
    fireEvent.click(viewButton);
    
    expect(screen.getByText('test1@example.com')).toBeInTheDocument();
    expect(screen.getByText('+998901234567')).toBeInTheDocument();
  });

  test('creates new user', async () => {
    server.use(
      rest.post(`${API_URL}/admin/users/`, (req, res, ctx) => {
        return res(
          ctx.status(201),
          ctx.json({
            id: 3,
            firstName: 'New',
            lastName: 'User',
            email: 'new@example.com',
            phone: '+998909876543',
            role: 'customer',
            isActive: true
          })
        );
      })
    );

    render(<UsersPage />, { preloadedState: mockAuthState });
    
    // Yangi foydalanuvchi qo'shish tugmasi
    fireEvent.click(screen.getByText(/yangi foydalanuvchi/i));
    
    // Forma to'ldirish
    fireEvent.change(screen.getByLabelText(/ism/i), {
      target: { value: 'New' }
    });
    fireEvent.change(screen.getByLabelText(/familiya/i), {
      target: { value: 'User' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'new@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/telefon/i), {
      target: { value: '+998909876543' }
    });
    
    // Saqlash
    fireEvent.click(screen.getByRole('button', { name: /saqlash/i }));
    
    // Yangi foydalanuvchi qo'shilganini tekshirish
    expect(await screen.findByText('New User')).toBeInTheDocument();
  });

  test('edits user', async () => {
    server.use(
      rest.put(`${API_URL}/admin/users/1/`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            ...mockUsers.results[0],
            firstName: 'Updated',
            lastName: 'User'
          })
        );
      })
    );

    render(<UsersPage />, { preloadedState: mockAuthState });
    
    // Tahrirlash tugmasini bosish
    const editButton = await screen.findByTestId('edit-user-1');
    fireEvent.click(editButton);
    
    // Ismni o'zgartirish
    const firstNameInput = screen.getByLabelText(/ism/i);
    fireEvent.change(firstNameInput, { target: { value: 'Updated' } });
    
    // Saqlash
    fireEvent.click(screen.getByRole('button', { name: /saqlash/i }));
    
    // O'zgarishlar saqlanganini tekshirish
    expect(await screen.findByText('Updated User')).toBeInTheDocument();
  });

  test('deactivates user', async () => {
    server.use(
      rest.patch(`${API_URL}/admin/users/1/deactivate/`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            ...mockUsers.results[0],
            isActive: false
          })
        );
      })
    );

    render(<UsersPage />, { preloadedState: mockAuthState });
    
    // Deaktivatsiya tugmasini bosish
    const deactivateButton = await screen.findByTestId('deactivate-user-1');
    fireEvent.click(deactivateButton);
    
    // Tasdiqlash
    fireEvent.click(screen.getByRole('button', { name: /tasdiqlash/i }));
    
    // Status o'zgarganini tekshirish
    await waitFor(() => {
      expect(screen.getByText(/faol emas/i)).toBeInTheDocument();
    });
  });

  test('filters users by role', async () => {
    render(<UsersPage />, { preloadedState: mockAuthState });
    
    const roleSelect = screen.getByLabelText(/rol/i);
    fireEvent.change(roleSelect, { target: { value: 'admin' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Test User 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test User 2')).toBeInTheDocument();
    });
  });

  test('searches users', async () => {
    render(<UsersPage />, { preloadedState: mockAuthState });
    
    const searchInput = screen.getByPlaceholderText(/qidirish/i);
    fireEvent.change(searchInput, { target: { value: 'test1@example.com' } });
    
    await waitFor(() => {
      expect(screen.getByText('Test User 1')).toBeInTheDocument();
      expect(screen.queryByText('Test User 2')).not.toBeInTheDocument();
    });
  });

  test('exports users list', async () => {
    render(<UsersPage />, { preloadedState: mockAuthState });
    
    const exportButton = await screen.findByText(/eksport/i);
    fireEvent.click(exportButton);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    const formatSelect = screen.getByLabelText(/format/i);
    fireEvent.change(formatSelect, { target: { value: 'csv' } });
    
    fireEvent.click(screen.getByText(/yuklash/i));
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('shows user activity history', async () => {
    const mockActivity = [
      { id: 1, action: 'login', createdAt: '2024-01-11T12:00:00Z' },
      { id: 2, action: 'order_created', createdAt: '2024-01-11T11:00:00Z' }
    ];

    server.use(
      rest.get(`${API_URL}/admin/users/1/activity/`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockActivity));
      })
    );

    render(<UsersPage />, { preloadedState: mockAuthState });
    
    const activityButton = await screen.findByTestId('view-activity-1');
    fireEvent.click(activityButton);
    
    expect(await screen.findByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/order_created/i)).toBeInTheDocument();
  });

  test('handles API error', async () => {
    server.use(
      rest.get(`${API_URL}/admin/users/`, (req, res) => {
        return res.networkError('Failed to connect');
      })
    );

    render(<UsersPage />, { preloadedState: mockAuthState });
    
    expect(await screen.findByText(/ma'lumotlarni yuklashda xatolik/i)).toBeInTheDocument();
  });
}); 