import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import RestaurantPage from '../pages/RestaurantPage';
import LoginPage from '../pages/auth/Login';
import RegisterPage from '../pages/auth/Register';
import ProfilePage from '../pages/ProfilePage';
import DeliveryPage from '../pages/DeliveryPage';
import AdminDashboard from '../pages/admin/Dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/restaurant/:id" element={<RestaurantPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/delivery" element={<DeliveryPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AppRoutes; 