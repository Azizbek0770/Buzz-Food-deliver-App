import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';
import { authAPI } from '../../services/api';
import Button from '../../components/common/Button';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    last_name: '',
    phone_number: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setError('Parollar mos kelmadi');
      return;
    }

    try {
      const { password_confirmation, ...registerData } = formData;
      const response = await authAPI.register(registerData);
      
      // Token formati: access va refresh
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      dispatch(loginSuccess({
        user: response.data.user,
        token: response.data.access,
        refresh: response.data.refresh
      }));
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      if (err.response?.data?.password) {
        setError(err.response.data.password[0]);
      } else if (err.response?.data?.username) {
        setError(err.response.data.username[0]);
      } else if (err.response?.data?.email) {
        setError(err.response.data.email[0]);
      } else {
        setError(err.response?.data?.detail || err.response?.data?.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-form">
        <h1>Ro'yxatdan o'tish</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Foydalanuvchi nomi</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Ism</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Familiya</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Telefon</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+998901234567"
            />
          </div>
          <div className="form-group">
            <label>Parol</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              placeholder="Kamida 8 ta belgi"
            />
          </div>
          <div className="form-group">
            <label>Parolni tasdiqlang</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              minLength={8}
              placeholder="Parolni qayta kiriting"
            />
          </div>
          <Button type="submit" fullWidth>
            Ro'yxatdan o'tish
          </Button>
        </form>
        <p className="login-link">
          Hisobingiz bormi? <Link to="/login">Kirish</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;