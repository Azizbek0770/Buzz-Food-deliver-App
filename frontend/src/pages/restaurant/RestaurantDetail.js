import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/common/Button';
import './RestaurantDetail.css';

const RestaurantDetail = () => {
  const { id } = useParams();
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

  if (loading) return <div className="loading">Yuklanmoqda...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!restaurant) return <div className="error">Restoran topilmadi</div>;

  return (
    <div className="restaurant-detail">
      <div className="restaurant-header">
        <img 
          src={restaurant.logo || '/default-restaurant.jpg'} 
          alt={restaurant.name}
          className="restaurant-logo"
        />
        <div className="restaurant-info">
          <h1>{restaurant.name}</h1>
          <p className="description">{restaurant.description}</p>
          <div className="meta-info">
            <span>
              <i className="fas fa-map-marker-alt"></i>
              {restaurant.address}
            </span>
            <span>
              <i className="fas fa-phone"></i>
              {restaurant.phone_number}
            </span>
            <span>
              <i className="fas fa-clock"></i>
              {restaurant.opening_time} - {restaurant.closing_time}
            </span>
          </div>
        </div>
      </div>

      <div className="menu-section">
        <h2>Menyu</h2>
        {restaurant.menu_items?.length > 0 ? (
          <div className="menu-grid">
            {restaurant.menu_items.map(item => (
              <div key={item.id} className="menu-item">
                <img 
                  src={item.image || '/default-food.jpg'} 
                  alt={item.name}
                />
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="item-footer">
                    <span className="price">{item.price} so'm</span>
                    <Button 
                      variant="primary"
                      size="small"
                      onClick={() => {/* TODO: Add to cart */}}
                    >
                      Savatga qo'shish
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-items">Hozircha menyu mavjud emas</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail; 