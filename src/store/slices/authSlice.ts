import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserSession {
  id: string;
  device: string;
  ip: string;
  location: string;
  lastActive: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  tier: 'Standard' | 'Premium' | 'Wealth';
  phone?: string;
  address?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  sessions: UserSession[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  sessions: [],
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      
      // Seed default sessions on first login
      state.sessions = [
        {
          id: '1',
          device: 'Chrome / Windows (Current)',
          ip: '192.168.1.45',
          location: 'Hyderabad, IN',
          lastActive: 'Just Now'
        },
        {
          id: '2',
          device: 'Safari / iPhone 15 Pro',
          ip: '103.54.21.9',
          location: 'Mumbai, IN',
          lastActive: '3 hours ago'
        }
      ];
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.sessions = [];
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    addSession: (state, action: PayloadAction<UserSession>) => {
      state.sessions.unshift(action.payload);
    },
    setSessions: (state, action: PayloadAction<UserSession[]>) => {
      state.sessions = action.payload;
    },
    terminateSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter(session => session.id !== action.payload);
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  setLoading,
  loginSuccess,
  logout,
  updateProfile,
  addSession,
  setSessions,
  terminateSession,
  setError
} = authSlice.actions;

export default authSlice.reducer;
