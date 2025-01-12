import React from 'react';
import { useDispatch } from 'react-redux';
import useFormValidation from '../../hooks/useFormValidation';
import { register } from '../../store/slices/authSlice';
import './RegisterForm.css';

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
};

const validationRules = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  email: {
    required: true,
    email: true
  },
  phone: {
    required: true,
    phone: true
  },
  password: {
    required: true,
    minLength: 8,
    password: true
  },
  confirmPassword: {
    required: true,
    custom: (value, values) => {
      if (value !== values.password) {
        return 'Parollar mos kelmadi';
      }
    }
  }
};

const RegisterForm = () => {
  const dispatch = useDispatch();
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm
  } = useFormValidation(initialValues, validationRules);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await dispatch(register(values)).unwrap();
        resetForm();
      } catch (error) {
        // Xatolik NotificationSystem orqali ko'rsatiladi
      }
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName] ? (
      <div className="error-message">
        {errors[fieldName].map((error, index) => (
          <p key={index}>{error}</p>
        ))}
      </div>
    ) : null;
  };

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">Ism</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.firstName && errors.firstName ? 'error' : ''}
          />
          {getFieldError('firstName')}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Familiya</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.lastName && errors.lastName ? 'error' : ''}
          />
          {getFieldError('lastName')}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.email && errors.email ? 'error' : ''}
        />
        {getFieldError('email')}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Telefon</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="+998XXXXXXXXX"
          className={touched.phone && errors.phone ? 'error' : ''}
        />
        {getFieldError('phone')}
      </div>

      <div className="form-group">
        <label htmlFor="password">Parol</label>
        <input
          type="password"
          id="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.password && errors.password ? 'error' : ''}
        />
        {getFieldError('password')}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Parolni tasdiqlang</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.confirmPassword && errors.confirmPassword ? 'error' : ''}
        />
        {getFieldError('confirmPassword')}
      </div>

      <button type="submit" className="submit-button">
        Ro'yxatdan o'tish
      </button>
    </form>
  );
};

export default RegisterForm; 