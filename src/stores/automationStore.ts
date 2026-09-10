import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface AutomationRule {
  id: number;
  name: string;
  description?: string;
  triggerType: 'transaction_added' | 'balance_low' | 'due_date' | 'recurring_executed' | 'periodic';
  triggerConditions?: any;
  actionType: 'allocate_savings' | 'send_notification' | 'create_transaction' | 'mark_paid';
  actionParams?: any;
  isActive: boolean;
  executionCount: number;
  lastExecutedAt?: string;
}

interface AutomationState {
  rules: AutomationRule[];
  loading: boolean;
}

export const useAutomationStore = defineStore('automation', {
  state: (): AutomationState => ({
    rules: [],
    loading: false
  }),

  getters: {
    activeRules(): AutomationRule[] {
      return this.rules.filter(r => r.isActive);
    }
  },

  actions: {
    async fetchRules() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/automations`);
        this.rules = response.data.data;
      } finally {
        this.loading = false;
      }
    },

    async createRule(data: Partial<AutomationRule>) {
      const response = await axios.post(`${API_URL}/automations`, data);
      this.rules.unshift(response.data.data);
      return response.data.data;
    },

    async updateRule(id: number, data: Partial<AutomationRule>) {
      const response = await axios.put(`${API_URL}/automations/${id}`, data);
      const index = this.rules.findIndex(r => r.id === id);
      if (index !== -1) {
        this.rules[index] = response.data.data;
      }
      return response.data.data;
    },

    async deleteRule(id: number) {
      await axios.delete(`${API_URL}/automations/${id}`);
      this.rules = this.rules.filter(r => r.id !== id);
    },

    async toggleRule(id: number) {
      const response = await axios.post(`${API_URL}/automations/${id}/toggle`);
      const index = this.rules.findIndex(r => r.id === id);
      if (index !== -1) {
        this.rules[index] = response.data.data;
      }
      return response.data.data;
    },

    async testRule(id: number, testData: any = {}) {
      const response = await axios.post(`${API_URL}/automations/${id}/test`, { testData });
      return response.data.data as { wouldTrigger: boolean; actionResult: any };
    },

    async executeAll() {
      const response = await axios.post(`${API_URL}/automations/execute`);
      await this.fetchRules();
      return response.data.data as { executedCount: number };
    }
  }
});
