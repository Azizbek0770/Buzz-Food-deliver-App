import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminStats from './AdminStats';
import AdminRestaurants from './AdminRestaurants';
import AdminUsers from './AdminUsers';
import AdminOrders from './AdminOrders';
import './AdminDashboard.css';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <Routes>
                <Route index element={<AdminStats />} />
                <Route path="restaurants/*" element={<AdminRestaurants />} />
                <Route path="users/*" element={<AdminUsers />} />
                <Route path="orders/*" element={<AdminOrders />} />
            </Routes>
        </div>
    );
};

export default AdminDashboard; 