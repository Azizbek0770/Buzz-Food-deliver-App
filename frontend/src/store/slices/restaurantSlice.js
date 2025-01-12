import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import restaurantService from '../../services/api/restaurant.service';

// Async actions
export const getRestaurants = createAsyncThunk(
  'restaurant/getRestaurants',
  async (params, { rejectWithValue }) => {
    try {
      const response = await restaurantService.getRestaurants(params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getRestaurantById = createAsyncThunk(
  'restaurant/getRestaurantById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await restaurantService.getRestaurantById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getRestaurantMenu = createAsyncThunk(
  'restaurant/getRestaurantMenu',
  async (id, { rejectWithValue }) => {
    try {
      const response = await restaurantService.getRestaurantMenu(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const searchRestaurants = createAsyncThunk(
  'restaurant/searchRestaurants',
  async (query, { rejectWithValue }) => {
    try {
      const response = await restaurantService.searchRestaurants(query);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  restaurants: [],
  currentRestaurant: null,
  menu: [],
  isLoading: false,
  error: null,
  filters: {
    category: null,
    rating: null,
    priceRange: null,
    sortBy: 'rating',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 12,
  },
  searchResults: [],
  searchQuery: '',
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Restaurants
      .addCase(getRestaurants.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRestaurants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.restaurants = action.payload.restaurants;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
          perPage: action.payload.perPage,
        };
      })
      .addCase(getRestaurants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Restaurant By Id
      .addCase(getRestaurantById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRestaurantById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRestaurant = action.payload;
      })
      .addCase(getRestaurantById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Restaurant Menu
      .addCase(getRestaurantMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRestaurantMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.menu = action.payload;
      })
      .addCase(getRestaurantMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Search Restaurants
      .addCase(searchRestaurants.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchRestaurants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchRestaurants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetError,
  setFilters,
  resetFilters,
  setCurrentPage,
  setSearchQuery,
  clearSearchResults,
} = restaurantSlice.actions;

export const {
  fetchRestaurants,
  fetchRestaurantById,
  fetchCategories,
  fetchProducts,
  fetchRestaurantDashboard,
  toggleRestaurantStatus
} = restaurantSlice.actions;

export const selectRestaurants = (state) => state.restaurant.restaurants;
export const selectCurrentRestaurant = (state) => state.restaurant.currentRestaurant;
export const selectMenu = (state) => state.restaurant.menu;
export const selectRestaurantLoading = (state) => state.restaurant.isLoading;
export const selectRestaurantError = (state) => state.restaurant.error;
export const selectFilters = (state) => state.restaurant.filters;
export const selectPagination = (state) => state.restaurant.pagination;
export const selectSearchResults = (state) => state.restaurant.searchResults;
export const selectSearchQuery = (state) => state.restaurant.searchQuery;

export default restaurantSlice.reducer; 