import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/slices/authSlice';
import Input from '../components/common/Input/Input';
import Button from '../components/common/Button/Button';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
              >
                Tahrirlash
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Ism"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />

            <Input
              label="Telefon"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />

            <Input
              label="Manzil"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
            />

            {error && (
              <p className="text-red-500 text-sm mt-2">
                {error.message || 'Xatolik yuz berdi'}
              </p>
            )}

            {isEditing && (
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Saqlanmoqda...' : 'Saqlash'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      address: user?.address || '',
                    });
                  }}
                  className="flex-1"
                >
                  Bekor qilish
                </Button>
              </div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Buyurtmalar tarixi</h2>
            {user?.orders?.length > 0 ? (
              <div className="space-y-4">
                {user.orders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Buyurtma #{order.id}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('uz-UZ')}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-sm rounded ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status === 'pending'
                          ? 'Kutilmoqda'
                          : order.status === 'processing'
                          ? 'Tayyorlanmoqda'
                          : order.status === 'delivered'
                          ? 'Yetkazildi'
                          : 'Bekor qilindi'}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Jami: {order.total_amount.toLocaleString()} so'm
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Buyurtmalar tarixi bo'sh</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 