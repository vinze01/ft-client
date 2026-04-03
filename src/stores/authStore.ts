import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router';
import type { AuthResponse, RegisterInput, User } from '../types';

interface AuthState {
  token: string;
  user: User | null;
}

const API_URL = 'http://localhost:3001/api';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    let user: User | null = null;
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        user = JSON.parse(userData);
      }
    } catch (e) {
      localStorage.removeItem('user');
    }
    return {
      token: localStorage.getItem('token') || '',
      user
    };
  },
  getters: {
    isAuthenticated: (state): boolean => !!state.token,
    fullName: (state): string => {
      if (!state.user) return '';
      const parts = [state.user.firstName];
      if (state.user.middleName) {
        parts.push(state.user.middleName);
      }
      parts.push(state.user.lastName);
      return parts.join(' ');
    },
  },
  actions: {
    setAuthHeader() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      }
    },
    async login(username: string, password: string): Promise<void> {
      const response = await axios.post<AuthResponse>(`${API_URL}/login`, { username, password });
      this.token = response.data.token;
      this.user = response.data.user;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
      this.setAuthHeader();
      await router.push('/dashboard');
    },
    async register(payload: RegisterInput | FormData): Promise<void> {
      const isFormData = payload instanceof FormData;
      const response = await axios.post(`${API_URL}/register`, payload, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
      });
      if (response.status === 201) {
        await router.push('/login');
      }
    },
    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      router.push('/login');
    },
  },
});
