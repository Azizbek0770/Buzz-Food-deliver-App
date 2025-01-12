import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import restaurantReducer from './slices/restaurantSlice';
import uiReducer from './slices/uiSlice';
import websocketReducer from './slices/websocketSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  order: orderReducer,
  restaurant: restaurantReducer,
  ui: uiReducer,
  websocket: websocketReducer
});

export default rootReducer;