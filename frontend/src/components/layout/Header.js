import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <i className="fas fa-utensils"></i>
          <span>FoodDelivery</span>
        </Link>

        <nav className="nav-menu">
          <Link to="/" className="nav-link">Bosh sahifa</Link>
          <Link to="/restaurants" className="nav-link">Restoranlar</Link>
          {user?.is_restaurant_owner && (
            <Link to="/dashboard" className="nav-link">Boshqaruv paneli</Link>
          )}
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <Link to="/cart" className="cart-button">
                <i className="fas fa-shopping-cart"></i>
                {items.length > 0 && (
                  <span className="cart-count">{items.length}</span>
                )}
              </Link>
              
              <div className="user-menu">
                <img 
                  src={user.profile_picture || '/default-avatar.png'} 
                  alt={user.username}
                  className="user-avatar"
                />
                <div className="user-dropdown">
                  <Link to="/profile">Profil</Link>
                  <Link to="/orders">Buyurtmalar</Link>
                  <button onClick={handleLogout}>Chiqish</button>
                </div>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="button button-secondary">Kirish</Link>
              <Link to="/register" className="button button-primary">Ro'yxatdan o'tish</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 