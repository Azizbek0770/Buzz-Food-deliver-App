import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/users/profile/');
                setProfile(response.data);
                setLoading(false);
            } catch (err) {
                setError('Profil ma\'lumotlarini yuklashda xatolik yuz berdi');
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div>Yuklanmoqda...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="profile-page">
            <h2>Profil</h2>
            <div className="profile-info">
                <div className="profile-header">
                    {profile?.profile_picture && (
                        <img 
                            src={profile.profile_picture} 
                            alt="Profile" 
                            className="profile-picture"
                        />
                    )}
                    <h3>{profile?.username}</h3>
                </div>
                <div className="profile-details">
                    <p><strong>Email:</strong> {profile?.email}</p>
                    <p><strong>Telefon:</strong> {profile?.phone_number}</p>
                    <p><strong>Manzil:</strong> {profile?.address}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; 