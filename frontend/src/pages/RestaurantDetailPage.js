import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';

const RestaurantDetailPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [restaurantData, menuData] = await Promise.all([
                    api.getRestaurant(id),
                    api.getRestaurantMenu(id)
                ]);
                setRestaurant(restaurantData.data);
                setMenu(menuData.data);
                setLoading(false);
            } catch (err) {
                setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const categories = ['all', ...new Set(menu.map(item => item.category))];

    const filteredMenu = activeCategory === 'all' 
        ? menu 
        : menu.filter(item => item.category === activeCategory);

    const handleAddToCart = (item) => {
        addToCart({
            ...item,
            restaurant_id: restaurant.id,
            restaurant_name: restaurant.name
        });
    };

    if (loading) return <div>Yuklanmoqda...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!restaurant) return <div>Restoran topilmadi</div>;

    return (
        <div className="restaurant-detail">
            <div className="restaurant-header">
                <img 
                    src={restaurant.logo} 
                    alt={restaurant.name} 
                    className="restaurant-logo"
                />
                <div className="restaurant-info">
                    <h1>{restaurant.name}</h1>
                    <p>{restaurant.description}</p>
                    <div className="restaurant-meta">
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
                <div className="category-filter">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category === 'all' ? 'Barcha taomlar' : category}
                        </button>
                    ))}
                </div>

                <div className="menu-grid">
                    {filteredMenu.map(item => (
                        <div key={item.id} className="menu-item">
                            <img src={item.image} alt={item.name} />
                            <div className="menu-item-info">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <div className="menu-item-footer">
                                    <span className="price">
                                        {item.price.toLocaleString()} so'm
                                    </span>
                                    <button 
                                        onClick={() => handleAddToCart(item)}
                                        disabled={!item.is_available}
                                    >
                                        {item.is_available ? 'Savatga qo\'shish' : 'Mavjud emas'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetailPage; 