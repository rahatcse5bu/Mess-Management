import api from './client';
import { Adjustment, AdjustmentType } from '../types';

export const adjustmentsApi = {
  getAll: async (
    from?: string,
    to?: string,
    memberId?: string,
    type?: string,
    includeVoided?: boolean
  ): Promise<Adjustment[]> => {
    const response = await api.get('/adjustments', { params: { from, to, memberId, type, includeVoided } });
    return response.data;
  },

  getOne: async (id: string): Promise<Adjustment> => {
    const response = await api.get(`/adjustments/${id}`);
    return response.data;
  },

  create: async (data: {
    date: string;
    memberId: string;
    amount: number;
    type: AdjustmentType;
    note?: string;
    relatedMemberId?: string;
  }): Promise<Adjustment> => {
    const response = await api.post('/adjustments', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Adjustment>): Promise<Adjustment> => {
    const response = await api.patch(`/adjustments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/adjustments/${id}`);
  },

  void: async (id: string, reason: string): Promise<Adjustment> => {
    const response = await api.patch(`/adjustments/${id}/void`, { reason });
    return response.data;
  },

  getSummary: async (from: string, to: string) => {
    const response = await api.get('/adjustments/summary', { params: { from, to } });
    return response.data;
  },

  getMemberTotals: async (memberId: string, from: string, to: string) => {
    const response = await api.get(`/adjustments/member/${memberId}/totals`, { params: { from, to } });
    return response.data;
  },

  getMemberHistory: async (memberId: string, from?: string, to?: string): Promise<Adjustment[]> => {
    const response = await api.get(`/adjustments/member/${memberId}/history`, { params: { from, to } });
    return response.data;
  },

  // Quick entry methods
  addPayment: async (memberId: string, amount: number, note?: string, date?: string): Promise<Adjustment> => {
    const response = await api.post('/adjustments/payment', { memberId, amount, note, date });
    return response.data;
  },

  addCredit: async (memberId: string, amount: number, note?: string, date?: string): Promise<Adjustment> => {
    const response = await api.post('/adjustments/credit', { memberId, amount, note, date });
    return response.data;
  },

  addDebit: async (memberId: string, amount: number, note?: string, date?: string): Promise<Adjustment> => {
    const response = await api.post('/adjustments/debit', { memberId, amount, note, date });
    return response.data;
  },

  createSettlement: async (
    fromMemberId: string,
    toMemberId: string,
    amount: number,
    note?: string,
    date?: string
  ) => {
    const response = await api.post('/adjustments/settlement', {
      fromMemberId,
      toMemberId,
      amount,
      note,
      date,
    });
    return response.data;
  },
};
