import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bankingReducer from './slices/bankingSlice';
import preferencesReducer from './slices/preferencesSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    banking: bankingReducer,
    preferences: preferencesReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
