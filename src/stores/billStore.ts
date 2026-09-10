import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface Bill {
  id: number;
  name: string;
  amount: number;
  categoryId?: number;
  accountId?: number;
  dueDay: number;
  frequency: 'monthly' | 'quarterly' | 'yearly' | 'one_time';
  nextDueDate: string;
  isSubscription: boolean;
  isPaid: boolean;
  paidDate?: string;
  reminderDays: number;
  notes?: string;
}

interface BillState {
  bills: Bill[];
  dueSoon: Bill[];
  loading: boolean;
}

export const useBillStore = defineStore('bill', {
  state: (): BillState => ({
    bills: [],
    dueSoon: [],
    loading: false
  }),

  getters: {
    unpaidBills(): Bill[] {
      return this.bills.filter(b => !b.isPaid);
    },
    subscriptions(): Bill[] {
      return this.bills.filter(b => b.isSubscription);
    },
    totalDue(): number {
      return this.bills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.amount, 0);
    }
  },

  actions: {
    async fetchBills(params?: { isSubscription?: boolean; isPaid?: boolean }) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/bills`, { params });
        this.bills = response.data.data;
      } finally {
        this.loading = false;
      }
    },

    async createBill(data: Partial<Bill>) {
      const response = await axios.post(`${API_URL}/bills`, data);
      this.bills.push(response.data.data);
      return response.data.data;
    },

    async updateBill(id: number, data: Partial<Bill>) {
      const response = await axios.put(`${API_URL}/bills/${id}`, data);
      const index = this.bills.findIndex(b => b.id === id);
      if (index !== -1) {
        this.bills[index] = response.data.data;
      }
      return response.data.data;
    },

    async deleteBill(id: number) {
      await axios.delete(`${API_URL}/bills/${id}`);
      this.bills = this.bills.filter(b => b.id !== id);
    },

    async markPaid(id: number, paidDate?: string) {
      const response = await axios.post(`${API_URL}/bills/${id}/mark-paid`, { paidDate });
      const index = this.bills.findIndex(b => b.id === id);
      if (index !== -1) {
        this.bills[index] = response.data.data;
      }
      return response.data.data;
    },

    async markUnpaid(id: number) {
      const response = await axios.post(`${API_URL}/bills/${id}/mark-unpaid`);
      const index = this.bills.findIndex(b => b.id === id);
      if (index !== -1) {
        this.bills[index] = response.data.data;
      }
      return response.data.data;
    },

    async fetchDueSoon(days: number = 7) {
      const response = await axios.get(`${API_URL}/bills/due-soon`, { params: { days } });
      this.dueSoon = response.data.data;
    }
  }
});