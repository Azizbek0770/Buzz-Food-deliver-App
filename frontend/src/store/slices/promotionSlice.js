import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchPromotions = createAsyncThunk(
  'promotions/fetchPromotions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/promotions/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createPromotion = createAsyncThunk(
  'promotions/createPromotion',
  async (promotionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/promotions/', promotionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const promotionSlice = createSlice({
  name: 'promotions',
  initialState: {
    promotions: [],
    loading: false,
    error: null,
    createLoading: false,
    createError: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch promotions
      .addCase(fetchPromotions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions = action.payload;
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create promotion
      .addCase(createPromotion.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createPromotion.fulfilled, (state, action) => {
        state.createLoading = false;
        state.promotions.push(action.payload);
      })
      .addCase(createPromotion.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      });
  }
});

export default promotionSlice.reducer; 