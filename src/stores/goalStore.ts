import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category: 'emergency' | 'investment' | 'purchase' | 'travel' | 'other';
  priority: 'low' | 'medium' | 'high';
  imageUrl?: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface GoalProgress {
  goal: Goal;
  progress: number;
  requiredMonthly: number;
  projectedCompletion: string | null;
  onTrack: boolean;
}

interface GoalState {
  goals: Goal[];
  summary: { totalGoals: number; completed: number; totalSaved: number; totalTarget: number } | null;
  loading: boolean;
}

export const useGoalStore = defineStore('goal', {
  state: (): GoalState => ({
    goals: [],
    summary: null,
    loading: false
  }),

  getters: {
    activeGoals(): Goal[] {
      return this.goals.filter(g => !g.isCompleted);
    },
    completedGoals(): Goal[] {
      return this.goals.filter(g => g.isCompleted);
    },
    totalTarget(): number {
      return this.goals.reduce((sum, g) => sum + g.targetAmount, 0);
    },
    totalSaved(): number {
      return this.goals.reduce((sum, g) => sum + g.currentAmount, 0);
    }
  },

  actions: {
    async fetchGoals(params?: { isCompleted?: boolean; category?: string }) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/goals`, { params });
        this.goals = response.data.data;
      } finally {
        this.loading = false;
      }
    },

    async createGoal(data: Partial<Goal>) {
      const response = await axios.post(`${API_URL}/goals`, data);
      this.goals.push(response.data.data);
      return response.data.data;
    },

    async updateGoal(id: number, data: Partial<Goal>) {
      const response = await axios.put(`${API_URL}/goals/${id}`, data);
      const index = this.goals.findIndex(g => g.id === id);
      if (index !== -1) {
        this.goals[index] = response.data.data;
      }
      return response.data.data;
    },

    async deleteGoal(id: number) {
      await axios.delete(`${API_URL}/goals/${id}`);
      this.goals = this.goals.filter(g => g.id !== id);
    },

    async contribute(id: number, amount: number, note?: string) {
      const response = await axios.post(`${API_URL}/goals/${id}/contribute`, { amount, note });
      await this.fetchGoals();
      return response.data.data;
    },

    async getProgress(id: number): Promise<GoalProgress> {
      const response = await axios.get(`${API_URL}/goals/${id}/progress`);
      return response.data.data;
    },

    async fetchSummary() {
      const response = await axios.get(`${API_URL}/goals/summary`);
      this.summary = response.data.data;
    }
  }
});