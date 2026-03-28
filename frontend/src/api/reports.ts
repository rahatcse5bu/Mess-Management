import api from './client';
import { DueSummaryReport } from '../types';

export const reportsApi = {
  getDueSummary: async (from: string, to: string): Promise<DueSummaryReport> => {
    const response = await api.get('/reports/due-summary', { params: { from, to } });
    return response.data;
  },

  getMemberDetailedReport: async (memberId: string, from: string, to: string) => {
    const response = await api.get(`/reports/member/${memberId}`, { params: { from, to } });
    return response.data;
  },

  getMonthlyReport: async (year: number, month: number): Promise<DueSummaryReport> => {
    const response = await api.get(`/reports/monthly/${year}/${month}`);
    return response.data;
  },

  getStats: async (from: string, to: string) => {
    const response = await api.get('/reports/stats', { params: { from, to } });
    return response.data;
  },
};
