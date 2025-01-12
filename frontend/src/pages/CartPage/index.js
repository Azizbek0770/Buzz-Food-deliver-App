import React from 'react';
import { useCart } from '../../contexts/CartContext';
import './CartPage.css';

const CartPage = () => {
    const { items, removeFromCart } = useCart();

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            {items.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div className="cart-items">
                    {items.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.image} alt={item.name} />
                            <div className="item-details">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ${item.price * item.quantity}</p>
                            </div>
                            <button 
                                onClick={() => removeFromCart(item.id)}
                                className="remove-btn"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CartPage; 