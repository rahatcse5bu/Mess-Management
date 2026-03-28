import api from './client';
import { CookerConfig, CookingHistory, CookingPreview } from '../types';

export const cookingApi = {
  getConfig: async (days = 30): Promise<{ config: CookerConfig; preview: CookingPreview[] }> => {
    const response = await api.get('/cooking/config', { params: { days } });
    return response.data;
  },

  updateConfig: async (data: {
    termDays?: number;
    memberOrder?: string[];
    rotationStartDate?: string;
    currentIndex?: number;
    autoRotate?: boolean;
  }): Promise<CookerConfig> => {
    const response = await api.patch('/cooking/config', data);
    return response.data;
  },

  reorderMembers: async (memberIds: string[]): Promise<CookerConfig> => {
    const response = await api.post('/cooking/reorder', { memberIds });
    return response.data;
  },

  syncMembers: async (): Promise<void> => {
    await api.post('/cooking/sync-members');
  },

  getCurrentCooker: async (date?: string) => {
    const response = await api.get('/cooking/current', { params: { date } });
    return response.data;
  },

  getPreview: async (days = 30): Promise<CookingPreview[]> => {
    const response = await api.get('/cooking/preview', { params: { days } });
    return response.data;
  },

  manualAssign: async (data: {
    date: string;
    memberId: string;
    note?: string;
    swappedWith?: string;
  }): Promise<CookingHistory> => {
    const response = await api.post('/cooking/manual-assign', data);
    return response.data;
  },

  swapCookers: async (date1: string, date2: string): Promise<void> => {
    await api.post('/cooking/swap', { date1, date2 });
  },

  removeOverride: async (date: string): Promise<void> => {
    await api.delete(`/cooking/override/${date}`);
  },

  getHistory: async (from: string, to: string): Promise<CookingHistory[]> => {
    const response = await api.get('/cooking/history', { params: { from, to } });
    return response.data;
  },

  getSchedule: async (from: string, to: string) => {
    const response = await api.get('/cooking/schedule', { params: { from, to } });
    return response.data;
  },

  addMemberToRotation: async (memberId: string, position?: number): Promise<CookerConfig> => {
    const response = await api.post('/cooking/add-member', { memberId, position });
    return response.data;
  },

  removeMemberFromRotation: async (memberId: string): Promise<CookerConfig> => {
    const response = await api.delete(`/cooking/remove-member/${memberId}`);
    return response.data;
  },
};
