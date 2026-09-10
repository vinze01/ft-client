import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface NotificationSettings {
  id?: number;
  budgetAlerts: boolean;
  billReminders: boolean;
  goalUpdates: boolean;
  weeklySummary: boolean;
  insights: boolean;
  securityAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings | null;
  loading: boolean;
}

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    notifications: [],
    unreadCount: 0,
    settings: null,
    loading: false
  }),

  getters: {
    unreadNotifications(): Notification[] {
      return this.notifications.filter(n => !n.isRead);
    }
  },

  actions: {
    async fetchNotifications(unreadOnly: boolean = false) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/notifications`, {
          params: unreadOnly ? { unread: 'true' } : {}
        });
        this.notifications = response.data.data;
      } finally {
        this.loading = false;
      }
    },

    async fetchUnreadCount() {
      const response = await axios.get(`${API_URL}/notifications/unread-count`);
      this.unreadCount = response.data.data.count || 0;
    },

    async markAsRead(id: number) {
      await axios.post(`${API_URL}/notifications/${id}/read`);
      const index = this.notifications.findIndex(n => n.id === id);
      if (index !== -1) {
        this.notifications[index].isRead = true;
      }
      await this.fetchUnreadCount();
    },

    async markAllAsRead() {
      await axios.post(`${API_URL}/notifications/read-all`);
      this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
      this.unreadCount = 0;
    },

    async deleteNotification(id: number) {
      await axios.delete(`${API_URL}/notifications/${id}`);
      this.notifications = this.notifications.filter(n => n.id !== id);
      await this.fetchUnreadCount();
    },

    async fetchSettings() {
      const response = await axios.get(`${API_URL}/notifications/settings`);
      this.settings = response.data.data;
    },

    async updateSettings(data: Partial<NotificationSettings>) {
      await axios.put(`${API_URL}/notifications/settings`, data);
      if (this.settings) {
        this.settings = { ...this.settings, ...data };
      }
    }
  }
});
