import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const SettingsPage = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        address: user?.address || '',
        profile_picture: null
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            profile_picture: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    data.append(key, formData[key]);
                }
            });

            await axios.patch('/api/users/profile/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccess('Profil muvaffaqiyatli yangilandi');
            setError('');
        } catch (err) {
            setError('Profilni yangilashda xatolik yuz berdi');
            setSuccess('');
        }
    };

    return (
        <div className="settings-page">
            <h2>Sozlamalar</h2>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Telefon:</label>
                    <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Manzil:</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Profil rasmi:</label>
                    <input
                        type="file"
                        name="profile_picture"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>
                <button type="submit">Saqlash</button>
            </form>
        </div>
    );
};

export default SettingsPage; 