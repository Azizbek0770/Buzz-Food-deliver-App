import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './StarRating.css';

const StarRating = ({ rating, totalReviews }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // To'liq yulduzlar
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`star-${i}`} className="star filled" />);
  }

  // Yarim yulduz
  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half-star" className="star half" />);
  }

  // Bo'sh yulduzlar
  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} className="star empty" />);
  }

  return (
    <div className="star-rating">
      <div className="stars">{stars}</div>
      {totalReviews !== undefined && (
        <span className="reviews-count">({totalReviews})</span>
      )}
    </div>
  );
};

export { StarRating };
export default StarRating; 