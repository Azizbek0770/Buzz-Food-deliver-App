import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { items = [] } = useSelector(state => state.cart || { items: [] });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <i className="fas fa-utensils"></i>
          <span>Buzz</span>
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="nav-item cart-link">
                <i className="fas fa-shopping-cart"></i>
                {items.length > 0 && <span className="cart-badge">{items.length}</span>}
              </Link>
              
              <Link to="/orders" className="nav-item">
                <i className="fas fa-list-alt"></i>
                <span>Buyurtmalar</span>
              </Link>

              {user?.role === 'admin' && (
                <Link to="/admin" className="nav-item">
                  <i className="fas fa-user-shield"></i>
                  <span>Admin Panel</span>
                </Link>
              )}

              {user?.role === 'delivery' && (
                <Link to="/delivery" className="nav-item">
                  <i className="fas fa-motorcycle"></i>
                  <span>Yetkazish</span>
                </Link>
              )}

              <div className="nav-item profile-menu">
                <button className="profile-button">
                  <i className="fas fa-user"></i>
                  <span>{user?.name}</span>
                </button>
                <div className="profile-dropdown">
                  <Link to="/profile" className="dropdown-item">
                    <i className="fas fa-user-cog"></i>
                    <span>Profil</span>
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Chiqish</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">
                <i className="fas fa-sign-in-alt"></i>
                <span>Kirish</span>
              </Link>
              <Link to="/register" className="nav-item">
                <i className="fas fa-user-plus"></i>
                <span>Ro'yxatdan o'tish</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 