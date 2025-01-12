import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { adminAPI } from '../../services/api';
import { Spinner } from '../../components/Spinner';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.is_superuser) {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getStats();
        setStats(response.data);
      } catch (err) {
        setError('Statistikani yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Panel</h1>
        <p>Xush kelibsiz, {user?.first_name} {user?.last_name}</p>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Buyurtmalar</h3>
          <p>Jami: {stats?.total_orders}</p>
          <p>Faol: {stats?.active_orders}</p>
          <Link to="/admin/orders" className="stat-link">
            Batafsil
          </Link>
        </div>
        <div className="stat-card">
          <h3>Restoranlar</h3>
          <p>Jami: {stats?.total_restaurants}</p>
          <p>Menu elementlari: {stats?.total_menu_items}</p>
          <Link to="/admin/restaurants" className="stat-link">
            Batafsil
          </Link>
        </div>
        <div className="stat-card">
          <h3>Foydalanuvchilar</h3>
          <p>Jami: {stats?.total_users}</p>
          <Link to="/admin/users" className="stat-link">
            Batafsil
          </Link>
        </div>
        <div className="stat-card">
          <h3>Daromad</h3>
          <p>{stats?.total_revenue?.toLocaleString()} so'm</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Tezkor harakatlar</h2>
        <div className="action-buttons">
          <Link to="/admin/restaurants/create" className="action-btn">
            Yangi restoran qo'shish
          </Link>
          <Link to="/admin/users/create" className="action-btn">
            Yetkazib beruvchi qo'shish
          </Link>
          <Link to="/admin/reports" className="action-btn">
            Hisobot yaratish
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;