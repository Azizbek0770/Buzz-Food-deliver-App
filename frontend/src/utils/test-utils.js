import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../store/rootReducer';

// Test uchun store yaratish
function createTestStore(preloadedState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  });
}

// Redux va Router bilan render qilish
function render(
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }
  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    store
  };
}

// Mock qilingan response yaratish
export const createMockResponse = (data, status = 200) => {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data
  };
};

// Mock qilingan error yaratish
export const createMockError = (message, status = 500) => {
  const error = new Error(message);
  error.response = {
    status,
    data: { message }
  };
  return error;
};

// Test uchun user data
export const mockUser = {
  id: 1,
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  phone: '+998901234567'
};

// Test uchun auth state
export const mockAuthState = {
  auth: {
    user: mockUser,
    token: 'mock-token',
    isAuthenticated: true,
    loading: false,
    error: null
  }
};

// WebSocket eventlarini simulyatsiya qilish
export const mockWebSocketEvent = (type, data) => {
  return new MessageEvent('message', {
    data: JSON.stringify({ type, data })
  });
};

// localStorage ni tozalash
export const clearLocalStorage = () => {
  localStorage.clear();
  jest.clearAllMocks();
};

// Test uchun delay
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Redux action va state o'zgarishlarini kutish
export const waitForRedux = async (store, predicate) => {
  const timeout = 5000;
  const start = Date.now();

  while (Date.now() - start < timeout) {
    if (predicate(store.getState())) {
      return true;
    }
    await delay(50);
  }

  throw new Error('Redux state change timeout');
};

// Export
export * from '@testing-library/react';
export { render }; 