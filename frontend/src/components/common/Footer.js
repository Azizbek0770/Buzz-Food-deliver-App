import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Buzz</h3>
          <p>Ovqat yetkazib berish xizmati</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-telegram"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Menyu</h4>
          <ul>
            <li><Link to="/">Bosh sahifa</Link></li>
            <li><Link to="/restaurants">Restoranlar</Link></li>
            <li><Link to="/about">Biz haqimizda</Link></li>
            <li><Link to="/contact">Bog'lanish</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Yordam</h4>
          <ul>
            <li><Link to="/faq">Ko'p so'raladigan savollar</Link></li>
            <li><Link to="/delivery">Yetkazib berish shartlari</Link></li>
            <li><Link to="/privacy">Maxfiylik siyosati</Link></li>
            <li><Link to="/terms">Foydalanish shartlari</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Bog'lanish</h4>
          <ul className="contact-info">
            <li>
              <i className="fas fa-phone"></i>
              <span>+998 90 123 45 67</span>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <span>info@buzz.uz</span>
            </li>
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <span>Toshkent sh., Chilonzor t., 1-uy</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Buzz. Barcha huquqlar himoyalangan.</p>
      </div>
    </footer>
  );
};

export default Footer; 