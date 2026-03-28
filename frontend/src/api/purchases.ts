import api from './client';
import { Purchase } from '../types';

export const purchasesApi = {
  getAll: async (from?: string, to?: string, category?: string): Promise<Purchase[]> => {
    const response = await api.get('/purchases', { params: { from, to, category } });
    return response.data;
  },

  getOne: async (id: string): Promise<Purchase> => {
    const response = await api.get(`/purchases/${id}`);
    return response.data;
  },

  create: async (data: {
    date: string;
    description: string;
    amount: number;
    category?: string;
    paidByMemberId?: string;
    note?: string;
    items?: string[];
  }): Promise<Purchase> => {
    const response = await api.post('/purchases', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Purchase>): Promise<Purchase> => {
    const response = await api.patch(`/purchases/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/purchases/${id}`);
  },

  getTotal: async (from: string, to: string): Promise<number> => {
    const response = await api.get('/purchases/total', { params: { from, to } });
    return response.data;
  },

  getSummaryByCategory: async (from: string, to: string) => {
    const response = await api.get('/purchases/summary/category', { params: { from, to } });
    return response.data;
  },

  getSummaryByMember: async (from: string, to: string) => {
    const response = await api.get('/purchases/summary/member', { params: { from, to } });
    return response.data;
  },

  getDailyTotals: async (from: string, to: string) => {
    const response = await api.get('/purchases/daily-totals', { params: { from, to } });
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/purchases/categories');
    return response.data;
  },
};
