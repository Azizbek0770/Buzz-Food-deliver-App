import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../../services/restaurantService';
import { Spinner } from '../../components/Spinner';
import { StarRating } from '../../components/StarRating';
import { FaMapMarkerAlt } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Kategoriyalarni yuklash
        const categoriesResponse = await restaurantAPI.getCategories();
        setCategories(categoriesResponse.data);

        // Restoranlarni yuklash
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category = selectedCategory;

        const restaurantsResponse = await restaurantAPI.getRestaurants(params);
        setRestaurants(restaurantsResponse.data);
      } catch (err) {
        setError('Restoranlarni yuklashda xatolik yuz berdi');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, selectedCategory]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Restoranni qidirish..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select
          className="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Barcha kategoriyalar</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="restaurants-grid">
        {restaurants.length === 0 ? (
          <div className="no-results">
            Restoranlar topilmadi
          </div>
        ) : (
          restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restaurants/${restaurant.id}`}
              className="restaurant-card"
            >
              <div className="restaurant-image">
                <img src={restaurant.logo} alt={restaurant.name} />
              </div>
              <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <p className="description">{restaurant.description}</p>
                <p className="address">
                  <FaMapMarkerAlt />
                  {restaurant.address}
                </p>
                <div className="restaurant-footer">
                  <div className="rating">
                    <StarRating rating={restaurant.rating} />
                    <span>({restaurant.total_reviews})</span>
                  </div>
                  <div className="category">
                    {restaurant.category.name}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage; 