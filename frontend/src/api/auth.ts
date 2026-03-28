import api from './client';
import { User } from '../types';

export interface LoginResponse {
  access_token: string;
  user: User;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string, name: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.patch('/auth/change-password', { oldPassword, newPassword });
  },
};
