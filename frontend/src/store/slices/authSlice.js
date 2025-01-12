import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setAuthCookie, clearAuthCookie } from '../../utils/cookies';
import { authAPI } from '../../services/api';

// Async actions
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Profilni yangilashda xatolik');
    }
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      setAuthCookie(action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      clearAuthCookie();
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  setUser, 
  resetError 
} = authSlice.actions;

export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectRestaurantId = (state) => state.auth.user?.restaurantId;

export default authSlice.reducer; 