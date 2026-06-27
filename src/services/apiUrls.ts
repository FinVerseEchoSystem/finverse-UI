// Centralized API Base URL configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Source of truth for all backend endpoints
export const API_URLS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    me: `${API_BASE_URL}/auth/me`,
    logout: `${API_BASE_URL}/auth/logout`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    verifyOtp: `${API_BASE_URL}/auth/verify-otp`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
    sessions: `${API_BASE_URL}/auth/sessions`,
    revokeSession: (sessionId: string) => `${API_BASE_URL}/auth/sessions/${sessionId}`,
    updateProfile: `${API_BASE_URL}/auth/profile`,
  },
  banking: {
    accounts: `${API_BASE_URL}/banking/accounts`,
    accountDetails: (accountId: string) => `${API_BASE_URL}/banking/accounts/${accountId}/details`,
    transactions: `${API_BASE_URL}/banking/transactions`,
    downloadStatement: `${API_BASE_URL}/banking/statements/download`,
  },
  beneficiaries: {
    list: `${API_BASE_URL}/banking/beneficiaries`,
    create: `${API_BASE_URL}/banking/beneficiaries`,
    update: (id: string) => `${API_BASE_URL}/banking/beneficiaries/${id}`,
    delete: (id: string) => `${API_BASE_URL}/banking/beneficiaries/${id}`,
  },
  transfers: {
    create: `${API_BASE_URL}/banking/transfers`,
  },
  preferences: {
    get: `${API_BASE_URL}/preferences`,
    update: `${API_BASE_URL}/preferences`,
  },
  notifications: {
    list: `${API_BASE_URL}/notifications`,
    read: (id: string) => `${API_BASE_URL}/notifications/${id}/read`,
    readAll: `${API_BASE_URL}/notifications/read-all`,
    clear: `${API_BASE_URL}/notifications`,
  },
} as const;

export default API_URLS;
