import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const AdminStats = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.getStats();
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div>Loading...</div>;

    return (
        <div className="admin-stats">
            <h2>Statistics</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>{stats.total_users}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Restaurants</h3>
                    <p>{stats.total_restaurants}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p>{stats.total_orders}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Orders</h3>
                    <p>{stats.active_orders}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminStats; 