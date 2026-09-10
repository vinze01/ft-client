<template>
  <div class="animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1">
          Notifications
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Alerts about budgets, bills, goals, and insights
        </p>
      </div>
      <button
        @click="markAllRead"
        :disabled="notificationStore.unreadCount === 0"
        class="btn btn-secondary"
      >
        Mark All Read
      </button>
    </div>

    <div class="card p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Preferences</h2>
      <div v-if="!notificationStore.settings" class="text-sm text-gray-500 dark:text-gray-400">
        Loading preferences...
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label
          v-for="key in settingKeys"
          :key="key"
          class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 cursor-pointer"
        >
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ settingLabels[key] }}</span>
          <input
            :checked="notificationStore.settings[key]"
            @change="toggleSetting(key)"
            type="checkbox"
            class="w-4 h-4"
          />
        </label>
      </div>
    </div>

    <div v-if="notificationStore.notifications.length === 0 && !notificationStore.loading" class="empty-state">
      <div class="empty-state-icon">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.003 2.003 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
      </div>
      <h3 class="empty-state-title">No notifications</h3>
      <p class="empty-state-description">You're all caught up</p>
    </div>

    <div class="space-y-3">
      <div
        v-for="note in notificationStore.notifications"
        :key="note.id"
        class="card p-4 flex items-start gap-3"
        :class="{ 'card-accent': !note.isRead }"
      >
        <div
          class="w-2 h-2 rounded-full mt-2 shrink-0"
          :class="note.isRead ? 'bg-gray-200 dark:bg-gray-700' : 'bg-[var(--accent-color)]'"
        ></div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="badge badge-neutral">{{ formatType(note.type) }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(note.createdAt) }}</span>
          </div>
          <h3 class="font-semibold text-gray-800 dark:text-white">{{ note.title }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ note.message }}</p>
        </div>
        <div class="flex gap-1 shrink-0">
          <button
            v-if="!note.isRead"
            @click="markRead(note.id)"
            class="btn btn-ghost text-sm"
            title="Mark as read"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </button>
          <button @click="deleteNote(note.id)" class="btn btn-ghost text-red-500 text-sm" title="Delete">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H6a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useNotificationStore, type NotificationSettings } from '../stores/notificationStore';
import { toast } from '../components/Toast.vue';
import { confirm } from '../components/ConfirmModal.vue';

type SettingKey = 'budgetAlerts' | 'billReminders' | 'goalUpdates' | 'weeklySummary' | 'insights' | 'securityAlerts' | 'emailNotifications' | 'pushNotifications';

export default defineComponent({
  name: 'NotificationsView',
  setup() {
    const notificationStore = useNotificationStore();

    const settingKeys: SettingKey[] = [
      'budgetAlerts',
      'billReminders',
      'goalUpdates',
      'weeklySummary',
      'insights',
      'securityAlerts',
      'emailNotifications',
      'pushNotifications'
    ];

    const settingLabels: Record<SettingKey, string> = {
      budgetAlerts: 'Budget alerts',
      billReminders: 'Bill reminders',
      goalUpdates: 'Goal updates',
      weeklySummary: 'Weekly summary',
      insights: 'Insights',
      securityAlerts: 'Security alerts',
      emailNotifications: 'Email notifications',
      pushNotifications: 'Push notifications'
    };

    const formatType = (type: string) => {
      return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const formatDate = (date: string) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const markRead = async (id: number) => {
      try {
        await notificationStore.markAsRead(id);
      } catch (e) {
        toast.error('Failed to mark notification as read');
      }
    };

    const markAllRead = async () => {
      try {
        await notificationStore.markAllAsRead();
        toast.success('All notifications marked as read');
      } catch (e) {
        toast.error('Failed to mark notifications as read');
      }
    };

    const deleteNote = async (id: number) => {
      const ok = await confirm({
        title: 'Delete Notification',
        content: 'Are you sure you want to delete this notification?',
        confirmText: 'Delete'
      });
      if (!ok) return;
      try {
        await notificationStore.deleteNotification(id);
        toast.success('Notification deleted');
      } catch (e) {
        toast.error('Failed to delete notification');
      }
    };

    const toggleSetting = async (key: SettingKey) => {
      if (!notificationStore.settings) return;
      const next = !notificationStore.settings[key];
      try {
        await notificationStore.updateSettings({ [key]: next } as Partial<NotificationSettings>);
        toast.success('Preferences updated');
      } catch (e) {
        toast.error('Failed to update preferences');
        await notificationStore.fetchSettings();
      }
    };

    onMounted(async () => {
      try {
        await notificationStore.fetchNotifications();
        await notificationStore.fetchUnreadCount();
        await notificationStore.fetchSettings();
      } catch (e) {
        toast.error('Failed to load notifications');
      }
    });

    return {
      notificationStore,
      settingKeys,
      settingLabels,
      formatType,
      formatDate,
      markRead,
      markAllRead,
      deleteNote,
      toggleSetting
    };
  }
});
</script>
