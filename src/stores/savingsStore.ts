import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface SavingsConfig {
  id: number;
  mode: 'fixed_percentage' | 'leftover_based' | 'goal_based';
  targetPercentage?: number;
  targetAccountId?: number;
  spendingAccountId?: number;
  minBalance: number;
  isActive: boolean;
  lastCalculatedAt?: string;
}

export interface SavingsAllocation {
  id: number;
  savingsConfigId: number;
  goalId?: number;
  amount: number;
  periodStart: string;
  periodEnd: string;
  status: string;
  goal?: { id: number; name: string };
}

export interface SavingsProjection {
  month: string;
  projectedSavings: number;
  cumulativeSavings: number;
}

interface SavingsState {
  config: SavingsConfig | null;
  allocations: SavingsAllocation[];
  projections: SavingsProjection[];
  totalProjected: number;
  lastCalculation: { allocated: number } | null;
  loading: boolean;
}

export const useSavingsStore = defineStore('savings', {
  state: (): SavingsState => ({
    config: null,
    allocations: [],
    projections: [],
    totalProjected: 0,
    lastCalculation: null,
    loading: false
  }),

  getters: {
    hasConfig(): boolean {
      return !!this.config;
    },
    isActive(): boolean {
      return !!this.config?.isActive;
    }
  },

  actions: {
    async fetchConfig() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/savings/config`);
        this.config = response.data.data;
      } finally {
        this.loading = false;
      }
    },

    async saveConfig(data: Partial<SavingsConfig>) {
      const response = await axios.post(`${API_URL}/savings/config`, data);
      this.config = response.data.data;
      return response.data.data;
    },

    async activate() {
      await axios.post(`${API_URL}/savings/config/activate`);
      if (this.config) this.config.isActive = true;
    },

    async deactivate() {
      await axios.post(`${API_URL}/savings/config/deactivate`);
      if (this.config) this.config.isActive = false;
    },

    async calculate(periodStart?: string, periodEnd?: string) {
      const response = await axios.post(`${API_URL}/savings/calculate`, {
        periodStart,
        periodEnd
      });
      this.lastCalculation = response.data.data;
      await this.fetchAllocations();
      return response.data.data;
    },

    async fetchAllocations() {
      const response = await axios.get(`${API_URL}/savings/allocations`);
      this.allocations = response.data.data;
    },

    async fetchProjection(months: number = 12) {
      const response = await axios.get(`${API_URL}/savings/projection`, {
        params: { months }
      });
      this.projections = response.data.data.projections || [];
      this.totalProjected = response.data.data.totalProjected || 0;
    }
  }
});
