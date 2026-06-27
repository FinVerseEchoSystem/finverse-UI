import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box, CircularProgress } from '@mui/material';

// Global stores
import { RootState } from './store/store';
import { useAuthStore } from './store/authStore';
import { authService } from './services/authService';
import { loginSuccess, logout as reduxLogout } from './store/slices/authSlice';

// Guards & Layouts
import { PrivateRoute, PublicRoute } from './routes/routes';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Core Pages
import Dashboard from './pages/dashboard/Dashboard';
import AccountSummary from './pages/banking/AccountSummary';
import AccountDetails from './pages/banking/AccountDetails';
import BeneficiaryManagement from './pages/banking/BeneficiaryManagement';
import FundTransfer from './pages/banking/FundTransfer';
import TransactionHistory from './pages/banking/TransactionHistory';
import Statements from './pages/banking/Statements';
import Profile from './pages/profile/Profile';
import Settings from './pages/settings/Settings';
import Sessions from './pages/Sessions';

// Create a QueryClient instance for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const [checkingSession, setCheckingSession] = useState(true);
  
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const reduxIsAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // 1. Initial Session Restoration from Mock Storage
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await authService.getCurrentUser();
        if (res.success && res.data) {
          useAuthStore.getState().loginSuccess(res.data);
        }
      } catch (e) {
        console.log("No active mock session restored");
      } finally {
        setCheckingSession(false);
      }
    };
    restoreSession();
  }, []);

  // 2. Zustand -> Redux Synchronization Bridge
  useEffect(() => {
    if (isAuthenticated && user) {
      if (!reduxIsAuthenticated || reduxUser?.email !== user.email) {
        dispatch(loginSuccess({
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl || '',
          tier: user.tier,
          phone: user.phone,
          address: user.address,
        }));
      }
    } else if (!checkingSession && !isAuthenticated && reduxIsAuthenticated) {
      dispatch(reduxLogout());
    }
  }, [user, isAuthenticated, reduxUser, reduxIsAuthenticated, checkingSession, dispatch]);

  // 3. Redux -> Zustand Synchronization Bridge
  useEffect(() => {
    if (reduxIsAuthenticated && reduxUser) {
      if (!isAuthenticated || user?.email !== reduxUser.email) {
        useAuthStore.getState().loginSuccess({
          id: 'user-redux-sync',
          email: reduxUser.email,
          name: reduxUser.name,
          phone: reduxUser.phone || '',
          address: reduxUser.address || '',
          avatarUrl: reduxUser.avatarUrl || null,
          tier: reduxUser.tier,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } else if (!checkingSession && !reduxIsAuthenticated && isAuthenticated) {
      useAuthStore.getState().logout();
    }
  }, [reduxUser, reduxIsAuthenticated, user, isAuthenticated, checkingSession]);

  if (checkingSession) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes (Wrapped under AuthLayout and PublicRoute guard) */}
          <Route
            element={
              <PublicRoute>
                <AuthLayout />
              </PublicRoute>
            }
          >
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* Fallbacks for other mock auth views */}
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Private Shell Layout Routes (Wrapped under DashboardLayout and PrivateRoute guard) */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="profile" element={<Profile />} />
            
            {/* Core Banking pages working in the new layout */}
            <Route path="accounts" element={<AccountSummary />} />
            <Route path="accounts/:id" element={<AccountDetails />} />
            <Route path="beneficiaries" element={<BeneficiaryManagement />} />
            <Route path="transfer" element={<FundTransfer />} />
            <Route path="transactions" element={<TransactionHistory />} />
            <Route path="statements" element={<Statements />} />
            <Route path="settings" element={<Settings />} />
            
            {/* Catch-all private fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
