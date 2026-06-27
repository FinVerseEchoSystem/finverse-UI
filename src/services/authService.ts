import { User, Session, AuthResponse, ApiResponse } from '../types/auth';
import { apiClient } from '../api/client';

const delay = (ms: number = 800) => new Promise((resolve) => setTimeout(resolve, ms));

// Setup initial state in local storage to keep state persistent during reload
const LOCAL_STORAGE_KEYS = {
  USERS: 'finverse_mock_users',
  SESSIONS: 'finverse_mock_sessions',
  CURRENT_USER: 'finverse_mock_current_user',
  ACCESS_TOKEN: 'accessToken',
};

const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    email: 'alex.mercer@finverse.com',
    name: 'Alex Mercer',
    phone: '+1 (555) 019-2834',
    address: '128 Pine St, San Francisco, CA 94103',
    avatarUrl: null,
    tier: 'Standard',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    email: 'premium.sterling@finverse.com',
    name: 'Sarah Sterling',
    phone: '+1 (555) 043-9812',
    address: '742 Evergreen Terrace, Seattle, WA 98101',
    avatarUrl: null,
    tier: 'Premium',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-3',
    email: 'wealth.wayne@finverse.com',
    name: 'Bruce Wayne',
    phone: '+1 (555) 007-1939',
    address: '1007 Mountain Drive, Gotham City, NJ 07001',
    avatarUrl: null,
    tier: 'Wealth',
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const getStoredUsers = (): User[] => {
  const usersStr = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
  if (!usersStr) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(usersStr);
};

const getStoredSessions = (userId: string): Session[] => {
  const sessionsStr = localStorage.getItem(LOCAL_STORAGE_KEYS.SESSIONS);
  if (!sessionsStr) {
    const initialSessions: Session[] = [
      {
        id: 'sess-1',
        userId,
        device: 'Chrome on Windows 11',
        ipAddress: '192.168.1.15',
        location: 'San Francisco, CA, USA',
        lastActive: new Date().toISOString(),
        isCurrent: true,
      },
      {
        id: 'sess-2',
        userId,
        device: 'Safari on iPhone 15 Pro',
        ipAddress: '172.56.21.89',
        location: 'Oakland, CA, USA',
        lastActive: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        isCurrent: false,
      },
      {
        id: 'sess-3',
        userId,
        device: 'Firefox on macOS Sonoma',
        ipAddress: '192.168.1.18',
        location: 'San Jose, CA, USA',
        lastActive: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isCurrent: false,
      },
    ];
    localStorage.setItem(LOCAL_STORAGE_KEYS.SESSIONS, JSON.stringify(initialSessions));
    return initialSessions;
  }
  return JSON.parse(sessionsStr);
};

export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    await delay(1000);
    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return {
        success: false,
        message: 'Invalid credentials. User with this email does not exist.',
      };
    }

    if (password !== 'password123') {
      return {
        success: false,
        message: 'Invalid credentials. Please enter password123.',
      };
    }

    // Success
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, 'mock-jwt-token-xyz');

    // Create current sessions
    const sessions = getStoredSessions(user.id);
    const updatedSessions = sessions.map(s => {
      if (s.isCurrent) {
        return { ...s, lastActive: new Date().toISOString() };
      }
      return s;
    });
    localStorage.setItem(LOCAL_STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions));

    return {
      success: true,
      message: 'Login successful.',
      data: {
        accessToken: 'mock-jwt-token-xyz',
        refreshToken: 'mock-refresh-token-abc',
        user,
      },
    };
  },

  forgotPassword: async (email: string): Promise<ApiResponse<{ otpToken: string }>> => {
    await delay(1000);
    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return {
        success: false,
        message: 'User with this email does not exist.',
      };
    }

    const mockOtpToken = 'otp-token-value-1234';
    sessionStorage.setItem('pending_reset_email', email);
    sessionStorage.setItem('pending_otp_token', mockOtpToken);
    
    // Console log the OTP for local demo purposes
    console.log(`[DEMO] Forgot password OTP sent to ${email}: 123456`);

    return {
      success: true,
      message: 'OTP has been sent to your email address (123456 for demo).',
      data: {
        otpToken: mockOtpToken,
      },
    };
  },

  verifyOtp: async (otpCode: string, otpToken: string): Promise<ApiResponse<{ resetToken: string }>> => {
    await delay(800);
    const storedOtpToken = sessionStorage.getItem('pending_otp_token');

    if (otpToken !== storedOtpToken) {
      return {
        success: false,
        message: 'Invalid or expired verification session.',
      };
    }

    if (otpCode !== '123456') {
      return {
        success: false,
        message: 'Invalid OTP code. Please use 123456.',
      };
    }

    const mockResetToken = 'reset-token-value-5678';
    sessionStorage.setItem('pending_reset_token', mockResetToken);

    return {
      success: true,
      message: 'OTP verified successfully.',
      data: {
        resetToken: mockResetToken,
      },
    };
  },

  resetPassword: async (password: string, resetToken: string): Promise<ApiResponse<null>> => {
    await delay(1000);
    const storedResetToken = sessionStorage.getItem('pending_reset_token');

    if (resetToken !== storedResetToken) {
      return {
        success: false,
        message: 'Invalid reset token or token expired.',
      };
    }

    // Reset password success! Clear session state
    sessionStorage.removeItem('pending_reset_email');
    sessionStorage.removeItem('pending_otp_token');
    sessionStorage.removeItem('pending_reset_token');

    return {
      success: true,
      message: 'Your password has been reset successfully. You can now log in.',
    };
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    await delay(500);
    const userStr = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    if (!userStr) {
      return {
        success: false,
        message: 'No active session found.',
      };
    }

    return {
      success: true,
      message: 'Session valid.',
      data: JSON.parse(userStr),
    };
  },

  updateProfile: async (data: { name: string; phone?: string; address?: string; avatarUrl?: string | null }): Promise<ApiResponse<User>> => {
    await delay(1000);
    const userStr = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    if (!userStr) {
      return {
        success: false,
        message: 'Authentication required to update profile.',
      };
    }

    const currentUserObj = JSON.parse(userStr) as User;
    const users = getStoredUsers();

    const updatedUser: User = {
      ...currentUserObj,
      name: data.name,
      phone: data.phone || '',
      address: data.address || '',
      avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : currentUserObj.avatarUrl,
      updatedAt: new Date().toISOString(),
    };

    // Update global user database list in storage
    const updatedUsers = users.map(u => u.id === currentUserObj.id ? updatedUser : u);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    
    // Update local current user
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));

    return {
      success: true,
      message: 'Profile updated successfully.',
      data: updatedUser,
    };
  },

  getSessions: async (): Promise<ApiResponse<Session[]>> => {
    await delay(600);
    const userStr = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    if (!userStr) {
      return {
        success: false,
        message: 'Authentication required to retrieve active sessions.',
      };
    }

    const currentUserObj = JSON.parse(userStr) as User;
    const sessions = getStoredSessions(currentUserObj.id);

    return {
      success: true,
      message: 'Active sessions retrieved.',
      data: sessions,
    };
  },

  revokeSession: async (sessionId: string): Promise<ApiResponse<null>> => {
    await delay(700);
    const userStr = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    if (!userStr) {
      return {
        success: false,
        message: 'Authentication required to revoke sessions.',
      };
    }

    const currentUserObj = JSON.parse(userStr) as User;
    const sessions = getStoredSessions(currentUserObj.id);
    const targetSession = sessions.find(s => s.id === sessionId);

    if (!targetSession) {
      return {
        success: false,
        message: 'Session not found.',
      };
    }

    if (targetSession.isCurrent) {
      return {
        success: false,
        message: 'You cannot revoke your active current session.',
      };
    }

    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(LOCAL_STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions));

    return {
      success: true,
      message: 'Session revoked successfully.',
    };
  },

  logout: async (): Promise<ApiResponse<null>> => {
    await delay(500);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    // Don't wipe sessions so they persist on relog, but set all to isCurrent = false except a dummy
    return {
      success: true,
      message: 'Logged out successfully.',
    };
  },

  register: async (fullname: string, email: string, password: string, tier: 'Standard' | 'Premium' | 'Wealth'): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await apiClient.post<ApiResponse<any>>('/auth/register', {
        fullname,
        email,
        password,
        tier,
      });

      const apiRes = response.data;
      if (apiRes.success && apiRes.data) {
        const backendData = apiRes.data;
        const userObj: User = {
          id: 'user-' + Math.random().toString(36).substr(2, 9),
          email: backendData.email,
          name: backendData.name,
          phone: '',
          address: '',
          avatarUrl: backendData.avatarUrl,
          tier: (backendData.tier as any) || 'Standard',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Store user and token in localStorage
        localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(userObj));
        localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, backendData.accessToken);
        if (backendData.refreshToken) {
          localStorage.setItem('refreshToken', backendData.refreshToken);
        }

        return {
          success: true,
          message: apiRes.message,
          data: {
            accessToken: backendData.accessToken,
            refreshToken: backendData.refreshToken,
            user: userObj,
          },
        };
      } else {
        return {
          success: false,
          message: apiRes.message || 'Registration failed.',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred during registration.',
      };
    }
  },

  refreshToken: async (token: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
    try {
      const response = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', {
        refreshToken: token,
      });

      const apiRes = response.data;
      if (apiRes.success && apiRes.data) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, apiRes.data.accessToken);
        localStorage.setItem('refreshToken', apiRes.data.refreshToken);
        return {
          success: true,
          message: apiRes.message,
          data: apiRes.data,
        };
      } else {
        return {
          success: false,
          message: apiRes.message || 'Token refresh failed.',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred during token refresh.',
      };
    }
  },
};

export default authService;
