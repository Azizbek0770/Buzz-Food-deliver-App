import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantById } from '../store/slices/restaurantSlice';
import { addToCart } from '../store/slices/cartSlice';
import Spinner from '../components/common/Spinner/Spinner';
import Button from '../components/common/Button/Button';

const RestaurantPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedRestaurant, isLoading, error } = useSelector(
    (state) => state.restaurant
  );
  const { items: cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    if (id) {
      dispatch(fetchRestaurantById(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = (menuItem) => {
    dispatch(
      addToCart({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        restaurantId: id,
        image_url: menuItem.image_url,
      })
    );
  };

  const getItemQuantityInCart = (itemId) => {
    const cartItem = cartItems.find((item) => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!selectedRestaurant) return <div>Restoran topilmadi</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="relative h-64">
          <img
            src={selectedRestaurant.image_url}
            alt={selectedRestaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-2">{selectedRestaurant.name}</h1>
              <p className="text-lg">{selectedRestaurant.description}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="text-yellow-400 mr-2">★</span>
              <span className="text-gray-700">{selectedRestaurant.rating}</span>
            </div>
            <div className="text-gray-600">
              <span className="mr-4">
                Yetkazib berish vaqti: {selectedRestaurant.delivery_time} min
              </span>
              <span>
                Minimal buyurtma: {selectedRestaurant.min_order_amount} so'm
              </span>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold mb-6">Menyu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedRestaurant.menu?.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">
                        {item.price.toLocaleString()} so'm
                      </span>
                      <div className="flex items-center">
                        {getItemQuantityInCart(item.id) > 0 ? (
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() =>
                                dispatch(
                                  addToCart({
                                    ...item,
                                    quantity: -1,
                                    restaurantId: id,
                                  })
                                )
                              }
                              variant="outline"
                              size="sm"
                            >
                              -
                            </Button>
                            <span className="mx-2">
                              {getItemQuantityInCart(item.id)}
                            </span>
                            <Button
                              onClick={() => handleAddToCart(item)}
                              variant="outline"
                              size="sm"
                            >
                              +
                            </Button>
                          </div>
                        ) : (
                          <Button onClick={() => handleAddToCart(item)}>
                            Savatga qo'shish
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage; 