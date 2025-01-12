import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../store/slices/orderSlice';
import Spinner from '../components/common/Spinner/Spinner';

const OrderPage = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error, pagination } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  if (isLoading) return <Spinner />;
  if (error) return <div>Xatolik yuz berdi: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mening buyurtmalarim</h1>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Sizda hali buyurtmalar yo'q</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    Buyurtma #{order.id}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
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

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Buyurtma tafsilotlari:</h4>
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span className="text-gray-600">
                        {item.price.toLocaleString()} so'm
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <span className="font-medium">Jami:</span>
                <span className="font-bold text-lg">
                  {order.total_amount.toLocaleString()} so'm
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          {/* Pagination component */}
        </div>
      )}
    </div>
  );
};

export default OrderPage; 