import api from './client';
import { MealDay, MealElement } from '../types';

export const mealsApi = {
  getMealDay: async (date: string): Promise<MealDay | null> => {
    const response = await api.get(`/meals/day/${date}`);
    return response.data;
  },

  getMealDaysInRange: async (from: string, to: string): Promise<MealDay[]> => {
    const response = await api.get('/meals/days', { params: { from, to } });
    return response.data;
  },

  upsertMealDay: async (data: {
    date: string;
    elements?: string[];
    entries?: { memberId: string; breakfast?: number; lunch?: number; dinner?: number; totalMeals?: number; note?: string }[];
    notes?: string;
    isLocked?: boolean;
  }): Promise<MealDay> => {
    const response = await api.post('/meals/day', data);
    return response.data;
  },

  quickAddMemberMeal: async (
    date: string,
    memberId: string,
    meals: { breakfast?: number; lunch?: number; dinner?: number }
  ): Promise<MealDay> => {
    const response = await api.post('/meals/quick-add', { date, memberId, ...meals });
    return response.data;
  },

  getMemberDailyCounts: async (from: string, to: string) => {
    const response = await api.get('/meals/member-daily-counts', { params: { from, to } });
    return response.data;
  },

  getMemberMealSummary: async (memberId: string, from: string, to: string) => {
    const response = await api.get(`/meals/member/${memberId}/summary`, { params: { from, to } });
    return response.data;
  },

  deleteMealDay: async (date: string): Promise<void> => {
    await api.delete(`/meals/day/${date}`);
  },

  // Meal Elements
  getAllElements: async (): Promise<MealElement[]> => {
    const response = await api.get('/meals/elements');
    return response.data;
  },

  createElement: async (data: { name: string; category?: string }): Promise<MealElement> => {
    const response = await api.post('/meals/elements', data);
    return response.data;
  },

  updateElement: async (id: string, data: Partial<MealElement>): Promise<MealElement> => {
    const response = await api.patch(`/meals/elements/${id}`, data);
    return response.data;
  },

  deleteElement: async (id: string): Promise<void> => {
    await api.delete(`/meals/elements/${id}`);
  },
};
