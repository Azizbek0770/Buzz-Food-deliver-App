import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { authAPI } from '../../services/api';
import Button from '../../components/common/Button';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
    setError(null);
    try {
      dispatch(loginStart());
      const response = await authAPI.login(formData);
      
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
      dispatch(loginFailure(err.response?.data?.detail || 'Login xatosi'));
      setError(err.response?.data?.detail || err.response?.data?.message || 'Login xatosi');
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h1>Kirish</h1>
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
            <label>Parol</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>
          <Button type="submit" fullWidth>
            Kirish
          </Button>
        </form>
        <p className="register-link">
          Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;