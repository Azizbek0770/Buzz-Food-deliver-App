import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DeliveryRoute = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'delivery') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default DeliveryRoute; 