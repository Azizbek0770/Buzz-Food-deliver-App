import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './PromotionCard.css';

const PromotionCard = ({ promotion }) => {
  const {
    id,
    title,
    description,
    image,
    discount,
    startDate,
    endDate,
    restaurantId,
    restaurantName
  } = promotion;

  const isActive = new Date() >= new Date(startDate) && new Date() <= new Date(endDate);

  return (
    <Link to={`/restaurants/${restaurantId}`} className="promotion-card">
      <div className="promotion-image">
        <img src={image} alt={title} />
        {isActive && (
          <div className="discount-badge">
            {discount}% chegirma
          </div>
        )}
      </div>
      
      <div className="promotion-content">
        <h3>{title}</h3>
        <p className="restaurant-name">{restaurantName}</p>
        <p className="description">{description}</p>
        
        <div className="promotion-footer">
          <div className="date-range">
            <span>{new Date(startDate).toLocaleDateString('uz-UZ')}</span>
            <span> - </span>
            <span>{new Date(endDate).toLocaleDateString('uz-UZ')}</span>
          </div>
          
          <div className={`status ${isActive ? 'active' : 'inactive'}`}>
            {isActive ? 'Faol' : 'Tugagan'}
          </div>
        </div>
      </div>
    </Link>
  );
};

PromotionCard.propTypes = {
  promotion: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    discount: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    restaurantId: PropTypes.number.isRequired,
    restaurantName: PropTypes.string.isRequired
  }).isRequired
};

export default PromotionCard; 