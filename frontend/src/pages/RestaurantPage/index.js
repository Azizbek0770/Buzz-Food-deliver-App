import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { restaurantAPI } from '../../services/restaurantService';
import { Spinner } from '../../components/Spinner';
import { StarRating } from '../../components/StarRating';
import { FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';
import './RestaurantPage.css';

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [restaurantResponse, menuResponse] = await Promise.all([
          restaurantAPI.getRestaurant(id),
          restaurantAPI.getMenu(id)
        ]);

        setRestaurant(restaurantResponse.data);
        setMenuItems(menuResponse.data);
      } catch (err) {
        setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (error || !restaurant) {
    return (
      <div className="error-message">
        {error || 'Restoran topilmadi'}
      </div>
    );
  }

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];
  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="restaurant-page">
      <div className="restaurant-header">
        <img src={restaurant.logo} alt={restaurant.name} className="restaurant-logo" />
        <div className="restaurant-info">
          <h1>{restaurant.name}</h1>
          <p className="description">{restaurant.description}</p>
          <div className="details">
            <p>
              <FaMapMarkerAlt />
              {restaurant.address}
            </p>
            <p>
              <FaPhone />
              {restaurant.phone_number}
            </p>
            <p>
              <FaClock />
              {restaurant.opening_time} - {restaurant.closing_time}
            </p>
          </div>
          <div className="rating-info">
            <StarRating rating={restaurant.rating} />
            <span>({restaurant.total_reviews} sharhlar)</span>
          </div>
        </div>
      </div>

      <div className="menu-section">
        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category}
              className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'Barcha taomlar' : category}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="menu-item">
              <div className="menu-item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="menu-item-info">
                <h3>{item.name}</h3>
                <p className="description">{item.description}</p>
                <div className="menu-item-footer">
                  <span className="calories">{item.calories} kkal</span>
                  <span className="price">{item.price.toLocaleString()} so'm</span>
                </div>
                <button className="add-to-cart">Savatga qo'shish</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage; 