<template>
  <div class="animate-fade-in max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-1">Settings</h1>
      <p class="text-gray-500">Manage your account and preferences</p>
    </div>

    <div class="space-y-6">
      <!-- Profile Section -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Profile Information
        </h2>
        
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Avatar Section -->
          <div class="flex flex-col items-center">
            <div class="relative">
              <div class="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                <img v-if="form.avatar" :src="form.avatar" alt="Avatar" class="w-full h-full object-cover" />
                <span v-else>{{ initials }}</span>
              </div>
              <button 
                @click="triggerAvatarUpload" 
                class="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13h3m-3 4h2"></path>
                </svg>
              </button>
              <input 
                ref="avatarInput" 
                type="file" 
                accept="image/*" 
                class="hidden" 
                @change="handleAvatarChange"
              />
            </div>
            <p class="text-xs text-gray-500 mt-2">Click to change photo</p>
          </div>

          <!-- Form Fields -->
          <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">First Name</label>
              <input v-model="form.firstName" type="text" class="input" />
            </div>
            <div>
              <label class="label">Middle Name</label>
              <input v-model="form.middleName" type="text" class="input" />
            </div>
            <div>
              <label class="label">Last Name</label>
              <input v-model="form.lastName" type="text" class="input" />
            </div>
            <div>
              <label class="label">Email</label>
              <input v-model="form.email" type="email" class="input" />
            </div>
            <div class="md:col-span-2">
              <label class="label">Contact Number</label>
              <input v-model="form.contactNo" type="tel" class="input" />
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="updateProfile" :disabled="savingProfile" class="btn btn-primary">
            <svg v-if="savingProfile" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ savingProfile ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>

      <!-- Change Password Section -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
          </svg>
          Change Password
        </h2>

        <div class="space-y-4 max-w-md">
          <div>
            <label class="label">Current Password</label>
            <input v-model="passwordForm.currentPassword" type="password" class="input" placeholder="Enter current password" />
          </div>
          <div>
            <label class="label">New Password</label>
            <input v-model="passwordForm.newPassword" type="password" class="input" placeholder="Enter new password" />
          </div>
          <div>
            <label class="label">Confirm New Password</label>
            <input v-model="passwordForm.confirmPassword" type="password" class="input" placeholder="Confirm new password" />
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="changePassword" :disabled="savingPassword" class="btn btn-primary">
            <svg v-if="savingPassword" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ savingPassword ? 'Updating...' : 'Update Password' }}
          </button>
        </div>
      </div>

      <!-- Delete Account Section -->
      <div class="card p-6 border-red-200">
        <h2 class="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          Danger Zone
        </h2>
        <p class="text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button 
          @click="confirmDeleteAccount" 
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Delete Account
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { toast } from '../components/Toast.vue';
import { confirm } from '../components/ConfirmModal.vue';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export default defineComponent({
  name: 'SettingsView',
  setup() {
    const authStore = useAuthStore();
    const avatarInput = ref<HTMLInputElement | null>(null);
    const savingProfile = ref(false);
    const savingPassword = ref(false);

    const form = reactive({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      contactNo: '',
      avatar: '' as string | null
    });

    const passwordForm = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const initials = computed(() => {
      if (!form.firstName || !form.lastName) return '?';
      return `${form.firstName[0]}${form.lastName[0]}`.toUpperCase();
    });

    onMounted(() => {
      if (authStore.user) {
        form.firstName = authStore.user.firstName || '';
        form.middleName = authStore.user.middleName || '';
        form.lastName = authStore.user.lastName || '';
        form.email = authStore.user.email || '';
        form.contactNo = authStore.user.contactNo ? String(authStore.user.contactNo) : '';
        form.avatar = authStore.user.avatar || null;
      }
    });

    const triggerAvatarUpload = () => {
      avatarInput.value?.click();
    };

    const handleAvatarChange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/users/avatar`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        form.avatar = response.data.avatar;
        if (authStore.user) {
          authStore.user.avatar = response.data.avatar;
        }
        toast.success('Avatar updated successfully');
      } catch (error) {
        toast.error('Failed to update avatar');
      }
    };

    const updateProfile = async () => {
      savingProfile.value = true;
      try {
        const token = localStorage.getItem('token');
        await axios.put(`${API_URL}/users/profile`, {
          firstName: form.firstName,
          middleName: form.middleName,
          lastName: form.lastName,
          email: form.email,
          contactNo: parseInt(form.contactNo)
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (authStore.user) {
          authStore.user.firstName = form.firstName;
          authStore.user.middleName = form.middleName;
          authStore.user.lastName = form.lastName;
          authStore.user.email = form.email;
          authStore.user.contactNo = parseInt(form.contactNo);
        }
        toast.success('Profile updated successfully');
      } catch (error) {
        toast.error('Failed to update profile');
      } finally {
        savingProfile.value = false;
      }
    };

    const changePassword = async () => {
      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        toast.error('Please fill in all password fields');
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }

      savingPassword.value = true;
      try {
        const token = localStorage.getItem('token');
        await axios.put(`${API_URL}/users/password`, {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        passwordForm.currentPassword = '';
        passwordForm.newPassword = '';
        passwordForm.confirmPassword = '';
        toast.success('Password updated successfully');
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to change password');
      } finally {
        savingPassword.value = false;
      }
    };

    const confirmDeleteAccount = async () => {
      const ok = await confirm({
        title: 'Delete Account',
        content: 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
        type: 'danger',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      });

      if (ok) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`${API_URL}/users/account`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          localStorage.removeItem('token');
          window.location.href = '/login';
        } catch (error) {
          toast.error('Failed to delete account');
        }
      }
    };

    return {
      avatarInput,
      savingProfile,
      savingPassword,
      form,
      passwordForm,
      initials,
      triggerAvatarUpload,
      handleAvatarChange,
      updateProfile,
      changePassword,
      confirmDeleteAccount
    };
  }
});
</script>