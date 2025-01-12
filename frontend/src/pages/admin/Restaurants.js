import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Restaurants.css';

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    category: '',
    is_active: true
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurants/');
      setRestaurants(response.data);
      setLoading(false);
    } catch (err) {
      setError('Restoranlarni yuklashda xatolik yuz berdi');
      setLoading(false);
    }
  };

  const handleEdit = (restaurant) => {
    setEditingId(restaurant.id);
    setFormData({
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      phone: restaurant.phone,
      category: restaurant.category,
      is_active: restaurant.is_active
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/restaurants/${editingId}/`, formData);
      } else {
        await api.post('/restaurants/', formData);
      }
      fetchRestaurants();
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        address: '',
        phone: '',
        category: '',
        is_active: true
      });
    } catch (err) {
      setError('Restoranni saqlashda xatolik yuz berdi');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Rostdan ham bu restoranni o\'chirmoqchimisiz?')) {
      try {
        await api.delete(`/restaurants/${id}/`);
        fetchRestaurants();
      } catch (err) {
        setError('Restoranni o\'chirishda xatolik yuz berdi');
      }
    }
  };

  if (loading) return <div className="loading">Yuklanmoqda...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-restaurants">
      <h1>Restoranlar boshqaruvi</h1>

      <form onSubmit={handleSubmit} className="restaurant-form">
        <h2>{editingId ? 'Restoranni tahrirlash' : 'Yangi restoran qo\'shish'}</h2>
        
        <div className="form-group">
          <label>Nomi</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Tavsif</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Manzil</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Telefon</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Kategoriya</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            required
          >
            <option value="">Tanlang</option>
            <option value="milliy">Milliy taomlar</option>
            <option value="fast-food">Fast Food</option>
            <option value="pizza">Pizza</option>
            <option value="desert">Desertlar</option>
          </select>
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
            />
            Faol
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingId ? 'Saqlash' : 'Qo\'shish'}
          </button>
          {editingId && (
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: '',
                  description: '',
                  address: '',
                  phone: '',
                  category: '',
                  is_active: true
                });
              }}
            >
              Bekor qilish
            </button>
          )}
        </div>
      </form>

      <div className="restaurants-table">
        <table>
          <thead>
            <tr>
              <th>Nomi</th>
              <th>Kategoriya</th>
              <th>Manzil</th>
              <th>Telefon</th>
              <th>Holat</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map(restaurant => (
              <tr key={restaurant.id}>
                <td>{restaurant.name}</td>
                <td>{restaurant.category}</td>
                <td>{restaurant.address}</td>
                <td>{restaurant.phone}</td>
                <td>
                  <span className={`status ${restaurant.is_active ? 'active' : 'inactive'}`}>
                    {restaurant.is_active ? 'Faol' : 'Nofaol'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(restaurant)}
                  >
                    Tahrirlash
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(restaurant.id)}
                  >
                    O'chirish
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRestaurants;