import React from 'react';
import PropTypes from 'prop-types';
import './ProductList.css';

const ProductList = ({
  products,
  selectedCategory,
  onEditProduct,
  onDeleteProduct
}) => {
  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoryId === selectedCategory.id)
    : products;

  return (
    <div className="product-list">
      <h3>
        {selectedCategory ? `${selectedCategory.name} mahsulotlari` : 'Barcha mahsulotlar'}
      </h3>
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <img 
              src={product.image} 
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h4>{product.name}</h4>
              <p className="product-description">{product.description}</p>
              <p className="product-price">{product.price.toLocaleString()} so'm</p>
            </div>
            <div className="product-actions">
              <button
                className="edit-btn"
                onClick={() => onEditProduct(product)}
              >
                ✏️
              </button>
              <button
                className="delete-btn"
                onClick={() => onDeleteProduct(product.id)}
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

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      categoryId: PropTypes.number.isRequired
    })
  ).isRequired,
  selectedCategory: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }),
  onEditProduct: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired
};

export default ProductList; 