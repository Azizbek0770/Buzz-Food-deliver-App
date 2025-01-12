import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const OrderForm = () => {
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    menu_item_id: item.id,
                    quantity: item.quantity
                })),
                delivery_address: address
            };

            const response = await axios.post('/api/orders/', orderData);
            clearCart();
            navigate(`/orders/${response.data.id}`);
        } catch (err) {
            setError('Buyurtma yaratishda xatolik yuz berdi');
        }
    };

    return (
        <div className="order-form">
            <h2>Buyurtma berish</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Yetkazib berish manzili:</label>
                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Buyurtma berish</button>
            </form>
        </div>
    );
};

export default OrderForm; 