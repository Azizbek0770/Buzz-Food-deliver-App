import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>FoodDelivery</h3>
          <p>Mazali taomlar yetkazib berish xizmati</p>
        </div>

        <div className="footer-section">
          <h4>Menyu</h4>
          <ul>
            <li><Link to="/restaurants">Restoranlar</Link></li>
            <li><Link to="/about">Biz haqimizda</Link></li>
            <li><Link to="/contact">Bog'lanish</Link></li>
            <li><Link to="/careers">Vakansiyalar</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Huquqiy</h4>
          <ul>
            <li><Link to="/terms">Foydalanish shartlari</Link></li>
            <li><Link to="/privacy">Maxfiylik siyosati</Link></li>
            <li><Link to="/faq">Ko'p so'raladigan savollar</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Bog'lanish</h4>
          <ul>
            <li>Tel: +998 90 123 45 67</li>
            <li>Email: info@fooddelivery.uz</li>
            <li>Manzil: Toshkent sh., Shayxontohur t.</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FoodDelivery. Barcha huquqlar himoyalangan.</p>
      </div>
    </footer>
  );
};

export default Footer; 