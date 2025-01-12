import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import MenuList from '../menu/MenuList';
import './RestaurantDetail.css';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await api.get(`/restaurants/${id}/`);
      setRestaurant(response.data);
      setLoading(false);
    } catch (err) {
      setError('Restoran ma\'lumotlarini yuklashda xatolik yuz berdi');
      setLoading(false);
    }
  };

  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!restaurant) return <div>Restoran topilmadi</div>;

  return (
    <div className="restaurant-detail">
      <div className="restaurant-header">
        <img 
          src={restaurant.logo || '/default-restaurant.png'} 
          alt={restaurant.name}
          className="restaurant-logo"
        />
        
        <div className="restaurant-info">
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          
          <div className="restaurant-meta">
            <span>
              <i className="fas fa-clock"></i>
              {restaurant.opening_time} - {restaurant.closing_time}
            </span>
            <span>
              <i className="fas fa-map-marker-alt"></i>
              {restaurant.address}
            </span>
            <span>
              <i className="fas fa-phone"></i>
              {restaurant.phone}
            </span>
          </div>
        </div>
      </div>

      <div className="menu-section">
        <h2>Menyu</h2>
        <MenuList 
          restaurantId={id} 
          onAddToCart={addItem}
        />
      </div>
    </div>
  );
};

export default RestaurantDetail; 