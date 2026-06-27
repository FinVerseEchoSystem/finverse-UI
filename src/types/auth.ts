export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  avatarUrl: string | null;
  tier: 'Standard' | 'Premium' | 'Wealth';
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  device: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
