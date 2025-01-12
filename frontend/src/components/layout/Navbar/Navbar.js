import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/authSlice';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          FoodDelivery
        </Link>

        <div className="navbar-links">
          <Link to="/restaurants" className="nav-link">
            Restoranlar
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/orders" className="nav-link">
                Buyurtmalar
              </Link>
              <Link to="/cart" className="nav-link cart-link">
                Savatcha
                {totalQuantity > 0 && (
                  <span className="cart-badge">{totalQuantity}</span>
                )}
              </Link>
              <div className="nav-dropdown">
                <button className="nav-dropdown-btn">
                  {user?.name || 'Profil'}
                </button>
                <div className="nav-dropdown-content">
                  <Link to="/profile" className="dropdown-link">
                    Profil
                  </Link>
                  <button onClick={handleLogout} className="dropdown-link">
                    Chiqish
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Kirish
              </Link>
              <Link to="/register" className="nav-link">
                Ro'yxatdan o'tish
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 