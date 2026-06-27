import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationPrefs {
  email: boolean;
  sms: boolean;
  push: boolean;
}

interface PreferencesState {
  theme: 'dark' | 'light';
  currency: 'USD' | 'EUR' | 'GBP' | 'INR';
  notificationPrefs: NotificationPrefs;
}

const initialState: PreferencesState = {
  theme: 'dark',
  currency: 'USD',
  notificationPrefs: {
    email: true,
    sms: false,
    push: true,
  },
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      // Toggle class on body element for custom CSS styles
      if (state.theme === 'light') {
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
      }
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
      if (action.payload === 'light') {
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
      }
    },
    setCurrency: (state, action: PayloadAction<'USD' | 'EUR' | 'GBP' | 'INR'>) => {
      state.currency = action.payload;
    },
    updateNotificationPrefs: (state, action: PayloadAction<Partial<NotificationPrefs>>) => {
      state.notificationPrefs = { ...state.notificationPrefs, ...action.payload };
    },
  },
});

export const { toggleTheme, setTheme, setCurrency, updateNotificationPrefs } = preferencesSlice.actions;
export default preferencesSlice.reducer;
