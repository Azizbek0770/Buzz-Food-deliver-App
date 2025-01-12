import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h1>Admin Panel</h1>
          <p>Xush kelibsiz, {user?.name}</p>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/admin"
            className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/orders"
            className={`nav-link ${isActive('/admin/orders') ? 'active' : ''}`}
          >
            Buyurtmalar
          </Link>
          <Link
            to="/admin/restaurants"
            className={`nav-link ${isActive('/admin/restaurants') ? 'active' : ''}`}
          >
            Restoranlar
          </Link>
          <Link
            to="/admin/users"
            className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}
          >
            Foydalanuvchilar
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">
            Chiqish
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 