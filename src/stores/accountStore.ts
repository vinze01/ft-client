import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface Account {
  id: number;
  userId: number;
  name: string;
  type: 'cash' | 'bank' | 'e_wallet' | 'credit_card' | 'investment';
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
  isDefault: boolean;
}

export interface Transfer {
  id: number;
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  fee: number;
  note?: string;
  createdAt: string;
}

interface AccountState {
  accounts: Account[];
  transfers: Transfer[];
  summary: { totalBalance: number; byType: Record<string, number> } | null;
  loading: boolean;
}

export const useAccountStore = defineStore('account', {
  state: (): AccountState => ({
    accounts: [],
    transfers: [],
    summary: null,
    loading: false
  }),

  getters: {
    totalBalance(): number {
      return this.accounts.reduce((sum, acc) => sum + acc.balance, 0);
    },
    defaultAccount(): Account | undefined {
      return this.accounts.find(a => a.isDefault);
    },
    accountsByType() {
      return (type: string) => this.accounts.filter(a => a.type === type);
    }
  },

  actions: {
    async fetchAccounts() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/accounts`);
        this.accounts = response.data.data;
      } finally {
        this.loading = false;
      }
    },

    async createAccount(data: Partial<Account>) {
      const response = await axios.post(`${API_URL}/accounts`, data);
      this.accounts.push(response.data.data);
      return response.data.data;
    },

    async updateAccount(id: number, data: Partial<Account>) {
      const response = await axios.put(`${API_URL}/accounts/${id}`, data);
      const index = this.accounts.findIndex(a => a.id === id);
      if (index !== -1) {
        this.accounts[index] = response.data.data;
      }
      return response.data.data;
    },

    async deleteAccount(id: number) {
      await axios.delete(`${API_URL}/accounts/${id}`);
      this.accounts = this.accounts.filter(a => a.id !== id);
    },

    async fetchSummary() {
      const response = await axios.get(`${API_URL}/accounts/summary`);
      this.summary = response.data.data;
    },

    async transfer(data: { fromAccountId: number; toAccountId: number; amount: number; fee?: number; note?: string }) {
      const response = await axios.post(`${API_URL}/accounts/transfer`, data);
      await this.fetchAccounts();
      return response.data.data;
    },

    async fetchTransfers(params?: { fromDate?: string; toDate?: string; accountId?: number }) {
      const response = await axios.get(`${API_URL}/accounts/transfers`, { params });
      this.transfers = response.data.data;
    }
  }
});