import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface RecurringTransaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  categoryId?: number;
  accountId?: number;
  description?: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate?: string;
  nextExecution: string;
  executionDay?: number;
  autoGenerate: boolean;
  reminderDaysBefore: number;
  isActive: boolean;
  lastExecutedAt?: string;
}

interface RecurringState {
  recurring: RecurringTransaction[];
  upcoming: Record<string, RecurringTransaction[]> | null;
  loading: boolean;
}

export const useRecurringStore = defineStore('recurring', {
  state: (): RecurringState => ({
    recurring: [],
    upcoming: null,
    loading: false
  }),

  getters: {
    activeRecurring(): RecurringTransaction[] {
      return this.recurring.filter(r => r.isActive);
    },
    incomeRecurring(): RecurringTransaction[] {
      return this.recurring.filter(r => r.type === 'income');
    },
    expenseRecurring(): RecurringTransaction[] {
      return this.recurring.filter(r => r.type === 'expense');
    }
  },

  actions: {
    async fetchRecurring(params?: { type?: string; isActive?: boolean }) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/recurring`, { params });
        this.recurring = response.data.data;
      } finally {
        this.loading = false;
      }
    },

    async createRecurring(data: Partial<RecurringTransaction>) {
      const response = await axios.post(`${API_URL}/recurring`, data);
      this.recurring.push(response.data.data);
      return response.data.data;
    },

    async updateRecurring(id: number, data: Partial<RecurringTransaction>) {
      const response = await axios.put(`${API_URL}/recurring/${id}`, data);
      const index = this.recurring.findIndex(r => r.id === id);
      if (index !== -1) {
        this.recurring[index] = response.data.data;
      }
      return response.data.data;
    },

    async deleteRecurring(id: number) {
      await axios.delete(`${API_URL}/recurring/${id}`);
      this.recurring = this.recurring.filter(r => r.id !== id);
    },

    async execute(id: number, executeDate?: string) {
      const response = await axios.post(`${API_URL}/recurring/${id}/execute`, { executeDate });
      return response.data.data;
    },

    async fetchUpcoming(days: number = 30) {
      const response = await axios.get(`${API_URL}/recurring/upcoming`, { params: { days } });
      this.upcoming = response.data.data;
    }
  }
});