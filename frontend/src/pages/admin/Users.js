import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Users.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    is_active: true
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Foydalanuvchilarni yuklashda xatolik yuz berdi');
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      is_active: user.is_active
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/users/${editingId}/`, formData);
      } else {
        await api.post('/users/', formData);
      }
      fetchUsers();
      setEditingId(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        is_active: true
      });
    } catch (err) {
      setError('Foydalanuvchini saqlashda xatolik yuz berdi');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Rostdan ham bu foydalanuvchini o\'chirmoqchimisiz?')) {
      try {
        await api.delete(`/users/${id}/`);
        fetchUsers();
      } catch (err) {
        setError('Foydalanuvchini o\'chirishda xatolik yuz berdi');
      }
    }
  };

  if (loading) return <div className="loading">Yuklanmoqda...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-users">
      <h1>Foydalanuvchilar boshqaruvi</h1>

      <form onSubmit={handleSubmit} className="user-form">
        <h2>{editingId ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi qo\'shish'}</h2>
        
        <div className="form-group">
          <label>Ism</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
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
          <label>Rol</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            required
          >
            <option value="user">Foydalanuvchi</option>
            <option value="admin">Admin</option>
            <option value="delivery">Yetkazib beruvchi</option>
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
                  email: '',
                  phone: '',
                  role: 'user',
                  is_active: true
                });
              }}
            >
              Bekor qilish
            </button>
          )}
        </div>
      </form>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Ism</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Rol</th>
              <th>Holat</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <span className={`role ${user.role}`}>
                    {user.role === 'admin' ? 'Admin' : 
                     user.role === 'delivery' ? 'Yetkazib beruvchi' : 
                     'Foydalanuvchi'}
                  </span>
                </td>
                <td>
                  <span className={`status ${user.is_active ? 'active' : 'inactive'}`}>
                    {user.is_active ? 'Faol' : 'Nofaol'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(user)}
                  >
                    Tahrirlash
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(user.id)}
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

export default AdminUsers;