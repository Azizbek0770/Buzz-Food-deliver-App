import React from 'react';
import PropTypes from 'prop-types';
import './OrderDetails.css';

const OrderDetails = ({ order }) => {
  if (!order) return null;

  return (
    <div className="order-details">
      <h3>Buyurtma #{order.id} tafsilotlari</h3>
      
      <div className="customer-info">
        <h4>Mijoz ma'lumotlari</h4>
        <p>Ism: {order.customer_name}</p>
        <p>Telefon: {order.customer_phone}</p>
        <p>Manzil: {order.address}</p>
      </div>

      <div className="restaurant-info">
        <h4>Restoran ma'lumotlari</h4>
        <p>Nomi: {order.restaurant_name}</p>
        <p>Manzil: {order.restaurant_address}</p>
        <p>Telefon: {order.restaurant_phone}</p>
      </div>

      <div className="items-list">
        <h4>Buyurtma tarkibi</h4>
        <ul>
          {order.items.map(item => (
            <li key={item.id}>
              <span className="item-name">{item.name}</span>
              <span className="item-quantity">{item.quantity} x</span>
              <span className="item-price">{item.price} so'm</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="order-summary">
        <div className="summary-item">
          <span>Mahsulotlar narxi:</span>
          <span>{order.subtotal} so'm</span>
        </div>
        <div className="summary-item">
          <span>Yetkazib berish:</span>
          <span>{order.delivery_fee} so'm</span>
        </div>
        <div className="summary-item total">
          <span>Jami:</span>
          <span>{order.total_amount} so'm</span>
        </div>
      </div>

      <div className="delivery-notes">
        <h4>Qo'shimcha ma'lumotlar</h4>
        <p>{order.notes || 'Qo\'shimcha ma\'lumotlar mavjud emas'}</p>
      </div>
    </div>
  );
};

OrderDetails.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    customer_name: PropTypes.string.isRequired,
    customer_phone: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    restaurant_name: PropTypes.string.isRequired,
    restaurant_address: PropTypes.string.isRequired,
    restaurant_phone: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired
      })
    ).isRequired,
    subtotal: PropTypes.number.isRequired,
    delivery_fee: PropTypes.number.isRequired,
    total_amount: PropTypes.number.isRequired,
    notes: PropTypes.string
  })
};

export default OrderDetails; 