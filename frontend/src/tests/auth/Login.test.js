import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockAuthState } from '../../utils/test-utils';
import Login from '../../components/auth/Login';
import { server } from '../../mocks/server';
import { rest } from 'msw';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

describe('Login Component', () => {
  test('renders login form', () => {
    render(<Login />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/parol/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /kirish/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /kirish/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/email kiritish shart/i)).toBeInTheDocument();
    expect(await screen.findByText(/parol kiritish shart/i)).toBeInTheDocument();
  });

  test('shows error message for invalid credentials', async () => {
    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/parol/i), {
      target: { value: 'wrongpassword' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /kirish/i }));

    expect(await screen.findByText(/email yoki parol noto'g'ri/i)).toBeInTheDocument();
  });

  test('successfully logs in with valid credentials', async () => {
    const { store } = render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/parol/i), {
      target: { value: 'password' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /kirish/i }));

    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.isAuthenticated).toBe(true);
      expect(state.auth.user).toBeTruthy();
      expect(state.auth.token).toBe('mock-access-token');
    });
  });

  test('handles network error', async () => {
    server.use(
      rest.post(`${API_URL}/users/token/`, (req, res) => {
        return res.networkError('Failed to connect');
      })
    );

    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/parol/i), {
      target: { value: 'password' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /kirish/i }));

    expect(await screen.findByText(/tarmoq xatosi yuz berdi/i)).toBeInTheDocument();
  });

  test('shows loading state while submitting', async () => {
    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/parol/i), {
      target: { value: 'password' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /kirish/i }));
    
    expect(screen.getByRole('button', { name: /kirish/i })).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
}); 