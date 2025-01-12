import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import MenuItem from './MenuItem';
import './MenuList.css';
import PropTypes from 'prop-types';

const MenuList = ({ restaurantId, onAddToCart }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/menu/`);
      setMenuItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('Menyu elementlarini yuklashda xatolik yuz berdi');
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="menu-list">
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="menu-items">
        {filteredItems.map(item => (
          <MenuItem
            key={item.id}
            item={item}
            onAddToCart={() => onAddToCart({
              ...item,
              restaurantId: parseInt(restaurantId)
            })}
          />
        ))}
      </div>
    </div>
  );
};

MenuList.propTypes = {
  restaurantId: PropTypes.number.isRequired,
  onAddToCart: PropTypes.func.isRequired
};

export default MenuList; 