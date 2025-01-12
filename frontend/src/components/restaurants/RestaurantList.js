import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get('/api/restaurants/');
                setRestaurants(response.data);
                setLoading(false);
            } catch (err) {
                setError('Restoranlarni yuklashda xatolik yuz berdi');
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    if (loading) return <div>Yuklanmoqda...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="restaurant-list">
            <h2>Restoranlar</h2>
            <div className="restaurant-grid">
                {restaurants.map(restaurant => (
                    <div key={restaurant.id} className="restaurant-card">
                        <img src={restaurant.logo} alt={restaurant.name} />
                        <h3>{restaurant.name}</h3>
                        <p>{restaurant.description}</p>
                        <Link to={`/restaurants/${restaurant.id}`}>
                            <button>Menu</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantList; 