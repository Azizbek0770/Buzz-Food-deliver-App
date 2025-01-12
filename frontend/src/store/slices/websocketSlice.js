import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  connected: false,
  reconnecting: false,
  error: null
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    wsConnected: (state) => {
      state.connected = true;
      state.reconnecting = false;
      state.error = null;
    },
    wsDisconnected: (state) => {
      state.connected = false;
      state.reconnecting = false;
    },
    wsReconnecting: (state) => {
      state.reconnecting = true;
    },
    wsError: (state, action) => {
      state.error = action.payload;
      state.connected = false;
      state.reconnecting = false;
    }
  }
});

export const {
  wsConnected,
  wsDisconnected,
  wsReconnecting,
  wsError
} = websocketSlice.actions;

export const selectWebSocketState = (state) => state.websocket;

export default websocketSlice.reducer; 