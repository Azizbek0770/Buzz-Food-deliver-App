import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../common/Modal';
import './MenuManager.css';

const MenuManager = ({
  categories,
  products,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    categoryId: ''
  });

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (selectedCategory) {
      onUpdateCategory(selectedCategory.id, categoryForm);
    } else {
      onCreateCategory(categoryForm);
    }
    setIsAddingCategory(false);
    setCategoryForm({ name: '' });
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, productForm);
    } else {
      onCreateProduct(productForm);
    }
    setIsAddingProduct(false);
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      image: '',
      categoryId: ''
    });
  };

  return (
    <div className="menu-manager">
      <div className="categories-section">
        <div className="section-header">
          <h3>Kategoriyalar</h3>
          <button onClick={() => setIsAddingCategory(true)}>
            + Yangi kategoriya
          </button>
        </div>

        <div className="categories-list">
          {categories.map(category => (
            <div key={category.id} className="category-item">
              <span>{category.name}</span>
              <div className="category-actions">
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setCategoryForm({ name: category.name });
                    setIsAddingCategory(true);
                  }}
                >
                  O'zgartirish
                </button>
                <button onClick={() => onDeleteCategory(category.id)}>
                  O'chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="products-section">
        <div className="section-header">
          <h3>Taomlar</h3>
          <button onClick={() => setIsAddingProduct(true)}>
            + Yangi taom
          </button>
        </div>

        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <div className="product-info">
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <span className="price">{product.price.toLocaleString()} so'm</span>
              </div>
              <div className="product-actions">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setProductForm({
                      name: product.name,
                      description: product.description,
                      price: product.price,
                      image: product.image,
                      categoryId: product.categoryId
                    });
                    setIsAddingProduct(true);
                  }}
                >
                  O'zgartirish
                </button>
                <button onClick={() => onDeleteProduct(product.id)}>
                  O'chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isAddingCategory}
        onClose={() => {
          setIsAddingCategory(false);
          setSelectedCategory(null);
          setCategoryForm({ name: '' });
        }}
        title={selectedCategory ? "Kategoriyani o'zgartirish" : "Yangi kategoriya"}
      >
        <form onSubmit={handleCategorySubmit}>
          <div className="form-group">
            <label>Nomi</label>
            <input
              type="text"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ name: e.target.value })}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit">Saqlash</button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isAddingProduct}
        onClose={() => {
          setIsAddingProduct(false);
          setEditingProduct(null);
          setProductForm({
            name: '',
            description: '',
            price: '',
            image: '',
            categoryId: ''
          });
        }}
        title={editingProduct ? "Taomni o'zgartirish" : "Yangi taom"}
      >
        <form onSubmit={handleProductSubmit}>
          <div className="form-group">
            <label>Nomi</label>
            <input
              type="text"
              value={productForm.name}
              onChange={(e) =>
                setProductForm({ ...productForm, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Tavsif</label>
            <textarea
              value={productForm.description}
              onChange={(e) =>
                setProductForm({ ...productForm, description: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Narxi (so'm)</label>
            <input
              type="number"
              value={productForm.price}
              onChange={(e) =>
                setProductForm({ ...productForm, price: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Rasm URL</label>
            <input
              type="url"
              value={productForm.image}
              onChange={(e) =>
                setProductForm({ ...productForm, image: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Kategoriya</label>
            <select
              value={productForm.categoryId}
              onChange={(e) =>
                setProductForm({ ...productForm, categoryId: e.target.value })
              }
              required
            >
              <option value="">Kategoriyani tanlang</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit">Saqlash</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

MenuManager.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
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
  onCreateCategory: PropTypes.func.isRequired,
  onUpdateCategory: PropTypes.func.isRequired,
  onDeleteCategory: PropTypes.func.isRequired,
  onCreateProduct: PropTypes.func.isRequired,
  onUpdateProduct: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired
};

export default MenuManager; 