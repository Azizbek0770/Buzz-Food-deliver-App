import { jwtDecode } from 'jwt-decode';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

// Token validation
export const validateToken = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      store.dispatch(logout());
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

// Password validation
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push("Parol kamida 8 ta belgidan iborat bo'lishi kerak");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Parol kamida 1 ta katta harf o'z ichiga olishi kerak");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Parol kamida 1 ta kichik harf o'z ichiga olishi kerak");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Parol kamida 1 ta raqam o'z ichiga olishi kerak");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Parol kamida 1 ta maxsus belgi (!@#$%^&*) o'z ichiga olishi kerak");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Input sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Role-based access control
export const checkPermission = (userRoles, requiredRoles) => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  if (!userRoles || userRoles.length === 0) return false;

  return requiredRoles.some(role => userRoles.includes(role));
};

// Phone number validation
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\+998[0-9]{9}$/;
  return phoneRegex.test(phone);
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// XSS prevention
export const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// CSRF token management
export const getCSRFToken = () => {
  return document.querySelector('meta[name="csrf-token"]')?.content;
};

// Session management
export const clearSession = () => {
  localStorage.clear();
  sessionStorage.clear();
  store.dispatch(logout());
};

// Data encryption (for sensitive data in localStorage)
export const encryptData = (data) => {
  // Implementation depends on encryption library
  // Example using simple base64 (NOT SECURE for production)
  return btoa(JSON.stringify(data));
};

export const decryptData = (encryptedData) => {
  // Implementation depends on encryption library
  // Example using simple base64 (NOT SECURE for production)
  try {
    return JSON.parse(atob(encryptedData));
  } catch (error) {
    return null;
  }
}; 