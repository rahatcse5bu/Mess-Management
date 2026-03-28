import api from './client';
import { Member } from '../types';

export const membersApi = {
  getAll: async (includeInactive = false): Promise<Member[]> => {
    const response = await api.get('/members', { params: { includeInactive } });
    return response.data;
  },

  getOne: async (id: string): Promise<Member> => {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },

  create: async (data: Partial<Member>): Promise<Member> => {
    const response = await api.post('/members', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Member>): Promise<Member> => {
    const response = await api.patch(`/members/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/members/${id}`);
  },

  deactivate: async (id: string): Promise<Member> => {
    const response = await api.patch(`/members/${id}/deactivate`);
    return response.data;
  },

  reactivate: async (id: string): Promise<Member> => {
    const response = await api.patch(`/members/${id}/reactivate`);
    return response.data;
  },

  getActiveCookers: async (): Promise<Member[]> => {
    const response = await api.get('/members/cookers');
    return response.data;
  },

  updateCookerOrder: async (memberOrders: { memberId: string; order: number }[]): Promise<void> => {
    await api.patch('/members/order/update', { memberOrders });
  },
};
