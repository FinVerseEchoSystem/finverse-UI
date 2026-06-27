import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  read: boolean;
}

interface NotificationsState {
  items: NotificationItem[];
}

const initialState: NotificationsState = {
  items: [
    {
      id: 'n1',
      title: 'Security Alert',
      message: 'New login detected from Chrome on Windows.',
      type: 'info',
      timestamp: '5m ago',
      read: false,
    },
    {
      id: 'n2',
      title: 'Welcome to FinVerse',
      message: 'Explore your checking accounts, investments, and insurance options on the dashboard.',
      type: 'success',
      timestamp: '1h ago',
      read: true,
    },
  ],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationItem[]>) => {
      state.items = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<NotificationItem, 'id' | 'read' | 'timestamp'>>
    ) => {
      const newNotification: NotificationItem = {
        ...action.payload,
        id: `noti_${Date.now()}`,
        read: false,
        timestamp: 'Just Now',
      };
      state.items.unshift(newNotification);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) {
        item.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => (n.read = true));
    },
    clearNotifications: (state) => {
      state.items = [];
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotifications,
  removeNotification,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
