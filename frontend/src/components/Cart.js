import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { addItem, removeItem, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { useTranslation } from 'react-i18next';
import './Cart.css';

const Cart = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items, total } = useSelector(state => state.cart);

  const handleRemoveItem = (id) => {
    dispatch(removeItem(id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    } else {
      dispatch(removeItem(id));
    }
  };

  const handleAddItem = (item) => {
    dispatch(addItem(item));
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <p>{t('cart.empty')}</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>{t('cart.title')}</h2>
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p className="cart-item-price">{item.price.toLocaleString()} {t('common.currency')}</p>
            </div>
            <div className="cart-item-actions">
              <button 
                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                className="quantity-btn"
              >
                <FaMinus />
              </button>
              <span className="quantity">{item.quantity}</span>
              <button 
                onClick={() => handleAddItem(item)}
                className="quantity-btn"
              >
                <FaPlus />
              </button>
              <button 
                onClick={() => handleRemoveItem(item.id)}
                className="remove-btn"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div className="cart-total">
          <span>{t('cart.total')}:</span>
          <span>{total.toLocaleString()} {t('common.currency')}</span>
        </div>
        <button 
          className="checkout-btn"
          onClick={() => {/* Checkout logic */}}
        >
          {t('cart.checkout')}
        </button>
      </div>
    </div>
  );
};

export default Cart; 