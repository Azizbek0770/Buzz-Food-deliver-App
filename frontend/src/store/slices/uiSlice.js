import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  language: localStorage.getItem('language') || 'uz',
  notifications: [],
  isLoading: false,
  modal: {
    isOpen: false,
    type: null,
    props: null,
  },
  sidebar: {
    isOpen: false,
  },
  toast: {
    message: '',
    type: '',
    isVisible: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        props: action.payload.props,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        props: null,
      };
    },
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    showToast: (state, action) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type || 'info',
        isVisible: true,
      };
    },
    hideToast: (state) => {
      state.toast = {
        ...state.toast,
        isVisible: false,
      };
    },
  },
});

export const {
  setTheme,
  setLanguage,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  openModal,
  closeModal,
  toggleSidebar,
  showToast,
  hideToast,
} = uiSlice.actions;

export const selectTheme = (state) => state.ui.theme;
export const selectLanguage = (state) => state.ui.language;
export const selectNotifications = (state) => state.ui.notifications;
export const selectLoading = (state) => state.ui.isLoading;
export const selectModal = (state) => state.ui.modal;
export const selectSidebar = (state) => state.ui.sidebar;
export const selectToast = (state) => state.ui.toast;

export default uiSlice.reducer; 