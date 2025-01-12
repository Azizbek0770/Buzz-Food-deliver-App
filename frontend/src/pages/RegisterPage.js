import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../store/slices/authSlice';
import Input from '../components/common/Input/Input';
import Button from '../components/common/Button/Button';
import { validatePassword } from '../utils/security';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Parol validatsiyasi
    if (name === 'password') {
      const { isValid, errors } = validatePassword(value);
      setValidationErrors((prev) => ({
        ...prev,
        password: isValid ? '' : errors[0],
      }));
    }

    // Parolni tasdiqlash
    if (name === 'confirmPassword') {
      setValidationErrors((prev) => ({
        ...prev,
        confirmPassword:
          value === formData.password ? '' : 'Parollar mos kelmayapti',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validatsiya
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Ism kiritilishi shart';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email kiritilishi shart';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Telefon raqam kiritilishi shart';
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await dispatch(register(formData)).unwrap();
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Ro'yxatdan o'tish
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            label="Ism"
            value={formData.name}
            onChange={handleChange}
            error={validationErrors.name}
            required
          />

          <Input
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            error={validationErrors.email}
            required
          />

          <Input
            type="tel"
            name="phone"
            label="Telefon"
            value={formData.phone}
            onChange={handleChange}
            error={validationErrors.phone}
            placeholder="+998901234567"
            required
          />

          <Input
            type="password"
            name="password"
            label="Parol"
            value={formData.password}
            onChange={handleChange}
            error={validationErrors.password}
            required
          />

          <Input
            type="password"
            name="confirmPassword"
            label="Parolni tasdiqlash"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={validationErrors.confirmPassword}
            required
          />

          {error && (
            <p className="text-red-500 text-sm mt-2">
              {error.message || "Ro'yxatdan o'tishda xatolik yuz berdi"}
            </p>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? `Ro'yxatdan o'tish...` : `Ro'yxatdan o'tish`}
          </Button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Hisobingiz bormi?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700">
            Kirish
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage; 