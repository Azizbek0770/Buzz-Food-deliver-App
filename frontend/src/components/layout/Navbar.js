import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Food Delivery</Link>
            </div>
            
            <div className="nav-links">
                <Link to="/restaurants">Restoranlar</Link>
                
                {user ? (
                    <>
                        <Link to="/cart" className="cart-link">
                            Savat
                            {cartItems.length > 0 && (
                                <span className="cart-count">{cartItems.length}</span>
                            )}
                        </Link>
                        <Link to="/orders">Buyurtmalar</Link>
                        <Link to="/profile">Profil</Link>
                        <button onClick={handleLogout}>Chiqish</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Kirish</Link>
                        <Link to="/register">Ro'yxatdan o'tish</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar; 