import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalAmount: 0,
  totalQuantity: 0,
  restaurantId: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      
      // Agar boshqa restorandan mahsulot qo'shilmoqchi bo'lsa
      if (state.restaurantId && state.restaurantId !== newItem.restaurantId) {
        state.items = [];
        state.totalAmount = 0;
        state.totalQuantity = 0;
      }
      
      state.restaurantId = newItem.restaurantId;
      
      const existingItem = state.items.find(
        (item) => item.id === newItem.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      } else {
        state.items.push({
          ...newItem,
          quantity: 1,
          totalPrice: newItem.price,
        });
      }

      state.totalQuantity++;
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      state.totalQuantity--;
      state.totalAmount -= existingItem.price;

      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
        if (state.items.length === 0) {
          state.restaurantId = null;
        }
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      state.restaurantId = null;
    },

    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      
      if (item) {
        const quantityDiff = quantity - item.quantity;
        item.quantity = quantity;
        item.totalPrice = quantity * item.price;
        
        state.totalQuantity += quantityDiff;
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        if (quantity === 0) {
          state.items = state.items.filter((item) => item.id !== id);
          if (state.items.length === 0) {
            state.restaurantId = null;
          }
        }
      }
    },
  },
});

export const { 
  addItem: addToCart,
  removeItem,
  updateItemQuantity,
  clearCart
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalAmount = (state) => state.cart.totalAmount;
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;
export const selectRestaurantId = (state) => state.cart.restaurantId;

export default cartSlice.reducer; 