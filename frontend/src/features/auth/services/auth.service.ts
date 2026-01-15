import { apiClient, API_ENDPOINTS } from '@/src/shared/lib/api';
import { LoginCredentials, RegisterData, User } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return response;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
};
