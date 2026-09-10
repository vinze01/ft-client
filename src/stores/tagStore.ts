import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface Tag {
  id: number;
  name: string;
  color: string;
}

interface TagState {
  tags: Tag[];
  loading: boolean;
}

export const useTagStore = defineStore('tag', {
  state: (): TagState => ({
    tags: [],
    loading: false
  }),

  actions: {
    async fetchTags() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/tags`);
        this.tags = response.data.data;
      } finally {
        this.loading = false;
      }
    },

    async createTag(data: { name: string; color?: string }) {
      const response = await axios.post(`${API_URL}/tags`, data);
      this.tags.push(response.data.data);
      return response.data.data;
    },

    async updateTag(id: number, data: { name?: string; color?: string }) {
      const response = await axios.put(`${API_URL}/tags/${id}`, data);
      const index = this.tags.findIndex(t => t.id === id);
      if (index !== -1) {
        this.tags[index] = response.data.data;
      }
      return response.data.data;
    },

    async deleteTag(id: number) {
      await axios.delete(`${API_URL}/tags/${id}`);
      this.tags = this.tags.filter(t => t.id !== id);
    },

    async addToTransactions(tagId: number, transactionIds: number[], transactionType: 'income' | 'expense') {
      await axios.post(`${API_URL}/tags/${tagId}/transactions`, {
        transactionIds,
        transactionType
      });
    },

    async getTagTransactions(tagId: number, type: 'income' | 'expense' = 'expense') {
      const response = await axios.get(`${API_URL}/tags/${tagId}/transactions`, {
        params: { type }
      });
      return response.data.data;
    }
  }
});