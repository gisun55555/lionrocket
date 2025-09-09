import { apiClient } from '@/shared/lib/api-client';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  CheckEmailParams,
} from '@/shared/types/api';

export const authApi = {
  register: async (data: RegisterRequest) => {
    const response = await apiClient.fetchNoAuth<AuthResponse>('/auth/register', 'POST', data);
    return response.data!;
  },

  login: async (data: LoginRequest) => {
    const response = await apiClient.fetchNoAuth<AuthResponse>('/auth/login', 'POST', data);
    return response.data!;
  },

  logout: async () => {
    const response = await apiClient.fetchAuth('/auth/logout', 'POST');
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.fetchAuth<User>('/auth/me');
    return response.data!;
  },

  checkEmail: async (params: CheckEmailParams) => {
    const response = await apiClient.fetchNoAuth<{ exists: boolean; message: string }>(
      `/auth/check-email?email=${encodeURIComponent(params.email)}`
    );
    return response.data!;
  },
} as const;
