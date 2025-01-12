import React from 'react';
import PropTypes from 'prop-types';
import './CategoryList.css';

const CategoryList = ({ 
  categories, 
  selectedCategory,
  onSelectCategory,
  onEditCategory,
  onDeleteCategory 
}) => {
  return (
    <div className="category-list">
      <h3>Kategoriyalar</h3>
      <div className="categories">
        {categories.map(category => (
          <div 
            key={category.id}
            className={`category-item ${selectedCategory?.id === category.id ? 'active' : ''}`}
          >
            <div 
              className="category-name"
              onClick={() => onSelectCategory(category)}
            >
              {category.name}
            </div>
            <div className="category-actions">
              <button 
                className="edit-btn"
                onClick={() => onEditCategory(category)}
              >
                ✏️
              </button>
              <button 
                className="delete-btn"
                onClick={() => onDeleteCategory(category.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedCategory: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }),
  onSelectCategory: PropTypes.func.isRequired,
  onEditCategory: PropTypes.func.isRequired,
  onDeleteCategory: PropTypes.func.isRequired
};

export default CategoryList; 