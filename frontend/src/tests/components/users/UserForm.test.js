import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../utils/test-utils';
import UserForm from '../../../components/users/UserForm';

describe('UserForm', () => {
  const mockUser = {
    id: 1,
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+998901234567',
    role: 'customer',
    isActive: true
  };

  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    loading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders empty form', () => {
    render(<UserForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/ism/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/familiya/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefon/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rol/i)).toBeInTheDocument();
  });

  test('renders form with user data', () => {
    render(<UserForm {...defaultProps} user={mockUser} />);
    
    expect(screen.getByLabelText(/ism/i)).toHaveValue('Test');
    expect(screen.getByLabelText(/familiya/i)).toHaveValue('User');
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/telefon/i)).toHaveValue('+998901234567');
    expect(screen.getByLabelText(/rol/i)).toHaveValue('customer');
  });

  test('validates required fields', async () => {
    render(<UserForm {...defaultProps} />);
    
    // Saqlash tugmasini bosish
    fireEvent.click(screen.getByRole('button', { name: /saqlash/i }));
    
    // Xatolik xabarlarini tekshirish
    expect(await screen.findByText(/ism kiritish shart/i)).toBeInTheDocument();
    expect(screen.getByText(/familiya kiritish shart/i)).toBeInTheDocument();
    expect(screen.getByText(/email kiritish shart/i)).toBeInTheDocument();
    expect(screen.getByText(/telefon kiritish shart/i)).toBeInTheDocument();
  });

  test('validates email format', async () => {
    render(<UserForm {...defaultProps} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    // Saqlash tugmasini bosish
    fireEvent.click(screen.getByRole('button', { name: /saqlash/i }));
    
    expect(await screen.findByText(/email formati noto'g'ri/i)).toBeInTheDocument();
  });

  test('validates phone format', async () => {
    render(<UserForm {...defaultProps} />);
    
    const phoneInput = screen.getByLabelText(/telefon/i);
    fireEvent.change(phoneInput, { target: { value: '12345' } });
    
    // Saqlash tugmasini bosish
    fireEvent.click(screen.getByRole('button', { name: /saqlash/i }));
    
    expect(await screen.findByText(/telefon formati noto'g'ri/i)).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    render(<UserForm {...defaultProps} />);
    
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
    fireEvent.change(screen.getByLabelText(/rol/i), {
      target: { value: 'customer' }
    });
    
    // Saqlash
    fireEvent.click(screen.getByRole('button', { name: /saqlash/i }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        firstName: 'New',
        lastName: 'User',
        email: 'new@example.com',
        phone: '+998909876543',
        role: 'customer'
      });
    });
  });

  test('handles form cancellation', () => {
    render(<UserForm {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /bekor qilish/i }));
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('shows loading state', () => {
    render(<UserForm {...defaultProps} loading={true} />);
    
    expect(screen.getByRole('button', { name: /saqlanmoqda/i })).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('disables form during loading', () => {
    render(<UserForm {...defaultProps} loading={true} />);
    
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toBeDisabled();
    });
  });

  test('shows server error', () => {
    render(<UserForm {...defaultProps} error="Email allaqachon mavjud" />);
    
    expect(screen.getByText(/email allaqachon mavjud/i)).toBeInTheDocument();
  });

  test('formats phone number while typing', () => {
    render(<UserForm {...defaultProps} />);
    
    const phoneInput = screen.getByLabelText(/telefon/i);
    fireEvent.change(phoneInput, { target: { value: '901234567' } });
    
    expect(phoneInput).toHaveValue('+99890 123 45 67');
  });

  test('trims whitespace from inputs', async () => {
    render(<UserForm {...defaultProps} />);
    
    // Forma to'ldirish
    fireEvent.change(screen.getByLabelText(/ism/i), {
      target: { value: ' John ' }
    });
    fireEvent.change(screen.getByLabelText(/familiya/i), {
      target: { value: ' Doe ' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: ' john@example.com ' }
    });
    
    // Saqlash
    fireEvent.click(screen.getByRole('button', { name: /saqlash/i }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      }));
    });
  });
}); 