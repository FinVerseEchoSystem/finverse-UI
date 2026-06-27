import { API_URLS } from './apiUrls';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  accounts?: any;
  transactions?: any;
  beneficiaries?: any;
  sessions?: any;
  [key: string]: any;
}

const request = async <T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> => {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    return await res.json();
  } catch (e) {
    return {
      success: false,
      message: 'Failed to communicate with the server. Please ensure the backend is running.',
    };
  }
};

export const mockApi = {
  // ─── Auth ────────────────────────────────────────────────────────────────
  login: async (email: string, password: string) =>
    request<any>(API_URLS.auth.login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: async (name: string, email: string, password: string, tier: 'Standard' | 'Premium' | 'Wealth') =>
    request<any>(API_URLS.auth.register, {
      method: 'POST',
      body: JSON.stringify({ name, email, password, tier }),
    }),

  getCurrentUser: async () =>
    request<any>(API_URLS.auth.me, { method: 'GET' }),

  logout: async () =>
    request<any>(API_URLS.auth.logout, { method: 'POST' }),

  updateProfile: async (data: { name: string; phone?: string; address?: string }) =>
    request<any>(API_URLS.auth.updateProfile, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // ─── Password Recovery ───────────────────────────────────────────────────
  sendOtp: async (email: string) =>
    request<{ otpToken: string }>(API_URLS.auth.forgotPassword, {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  verifyOtp: async (enteredOtp: string, _correctOtp?: string) =>
    request<null>(API_URLS.auth.verifyOtp, {
      method: 'POST',
      body: JSON.stringify({ otpCode: enteredOtp }),
    }),

  resetPassword: async (password: string) =>
    request<null>(API_URLS.auth.resetPassword, {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),

  // ─── Sessions ────────────────────────────────────────────────────────────
  getSessions: async () =>
    request<any>(API_URLS.auth.sessions, { method: 'GET' }),

  terminateSession: async (sessionId: string) =>
    request<any>(API_URLS.auth.revokeSession(sessionId), { method: 'DELETE' }),

  // ─── Banking ─────────────────────────────────────────────────────────────
  getAccounts: async () =>
    request<any>(API_URLS.banking.accounts, { method: 'GET' }),

  getTransactions: async (params?: {
    search?: string;
    accountId?: string;
    category?: string;
    type?: string;
    sortBy?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.accountId) query.append('accountId', params.accountId);
    if (params?.category) query.append('category', params.category);
    if (params?.type) query.append('type', params.type);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    const qs = query.toString();
    return request<any>(qs ? `${API_URLS.banking.transactions}?${qs}` : API_URLS.banking.transactions, {
      method: 'GET',
    });
  },

  performTransfer: async (data: {
    sourceAccountId: string;
    beneficiaryId: string;
    amount: number;
    remarks?: string;
    category?: string;
  }) =>
    request<any>(API_URLS.transfers.create, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ─── Beneficiaries ───────────────────────────────────────────────────────
  getBeneficiaries: async () =>
    request<any>(API_URLS.beneficiaries.list, { method: 'GET' }),

  createBeneficiary: async (data: {
    name: string;
    accountNumber: string;
    bankName: string;
    nickname?: string;
    email?: string;
  }) =>
    request<any>(API_URLS.beneficiaries.create, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateBeneficiary: async (
    id: string,
    data: { name: string; accountNumber: string; bankName: string; nickname?: string; email?: string },
  ) =>
    request<any>(API_URLS.beneficiaries.update(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteBeneficiary: async (id: string) =>
    request<any>(API_URLS.beneficiaries.delete(id), { method: 'DELETE' }),

  // ─── Preferences ─────────────────────────────────────────────────────────
  getPreferences: async () =>
    request<any>(API_URLS.preferences.get, { method: 'GET' }),

  updatePreferences: async (data: {
    theme?: string;
    currency?: string;
    notificationPrefs?: { email: boolean; sms: boolean; push: boolean };
  }) =>
    request<any>(API_URLS.preferences.update, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // ─── Notifications ───────────────────────────────────────────────────────
  getNotifications: async () =>
    request<any>(API_URLS.notifications.list, { method: 'GET' }),

  markNotificationRead: async (id: string) =>
    request<any>(API_URLS.notifications.read(id), { method: 'PUT' }),

  markAllNotificationsRead: async () =>
    request<any>(API_URLS.notifications.readAll, { method: 'PUT' }),

  clearAllNotifications: async () =>
    request<any>(API_URLS.notifications.clear, { method: 'DELETE' }),
};

export default mockApi;
