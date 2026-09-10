<template>
  <div class="animate-fade-in max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-1">
        Settings
      </h1>
      <p class="text-gray-500 dark:text-gray-400">
        Manage your account and preferences
      </p>
    </div>

    <div class="space-y-6">
      <!-- Profile Section -->
      <div class="card p-6">
        <h2
          class="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2"
        >
          <svg
            class="w-5 h-5"
            :style="{ color: themeStore.accentColor }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
          Profile Information
        </h2>

        <div class="flex flex-col md:flex-row gap-6">
          <!-- Avatar Section -->
          <div class="flex flex-col items-center">
            <div class="relative">
              <div
                class="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold"
              >
                <img
                  v-if="form.avatar"
                  :src="form.avatar"
                  alt="Avatar"
                  class="w-full h-full object-cover"
                />
                <span v-else>{{ initials }}</span>
              </div>
              <button
                @click="triggerAvatarUpload"
                class="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-colors"
                :style="{ backgroundColor: themeStore.accentColor }"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 13h3m-3 4h2"
                  ></path>
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
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Click to change photo
            </p>
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
          <button
            @click="updateProfile"
            :disabled="savingProfile"
            class="btn btn-primary"
          >
            <svg
              v-if="savingProfile"
              class="animate-spin w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ savingProfile ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </div>

      <!-- Theme Color Section -->
      <div class="card p-6">
        <h2
          class="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            ></path>
          </svg>
          Theme Color
        </h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Choose an accent color for buttons, links, and highlights.
        </p>

        <!-- Current Color Preview -->
        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-12 h-12 rounded-xl shadow-md"
            :style="{ backgroundColor: themeStore.accentColor }"
          ></div>
          <div>
            <p class="font-medium text-gray-800 dark:text-white">
              Current Accent
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ themeStore.accentColor }}
            </p>
          </div>
        </div>

        <!-- Preset Colors -->
        <div class="mb-6">
          <label class="label mb-3">Preset Colors</label>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="color in themeStore.presetColors"
              :key="color"
              @click="selectColor(color)"
              class="w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
              :class="
                themeStore.accentColor === color
                  ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600 scale-110'
                  : ''
              "
              :style="{ backgroundColor: color }"
              :title="color"
            ></button>
          </div>
        </div>

        <!-- Custom Color Picker -->
        <div class="mb-6">
          <label class="label mb-3">Custom Color</label>
          <div class="flex items-center gap-4">
            <input
              type="color"
              v-model="customColor"
              @change="selectColor(customColor)"
              class="w-12 h-12 rounded-xl cursor-pointer border-0 p-0 bg-transparent"
            />
            <input
              type="text"
              v-model="customColor"
              @blur="selectColor(customColor)"
              class="input w-32 uppercase"
              placeholder="#6366f1"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button @click="resetColor" class="btn btn-secondary">
            Reset to Default
          </button>
        </div>
      </div>

      <!-- Change Password Section -->
      <div class="card p-6">
        <h2
          class="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2"
        >
          <svg
            class="w-5 h-5 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            ></path>
          </svg>
          Change Password
        </h2>

        <div class="space-y-4 max-w-md">
          <div>
            <label class="label">Current Password</label>
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              class="input"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label class="label">New Password</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="input"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label class="label">Confirm New Password</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              class="input"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="changePassword"
            :disabled="savingPassword"
            class="btn btn-primary"
          >
            <svg
              v-if="savingPassword"
              class="animate-spin w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ savingPassword ? "Updating..." : "Update Password" }}
          </button>
        </div>
      </div>

      <!-- Data Export & Import Section -->
      <div class="card p-6">
        <h2
          class="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            ></path>
          </svg>
          Data Export & Import
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="label">Type</label>
            <select v-model="exportForm.type" class="input">
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label class="label">Format</label>
            <select v-model="exportForm.format" class="input">
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="exportTransactions" class="btn btn-secondary w-full">
              Download
            </button>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mb-4">
          <button @click="exportFullData" class="btn btn-secondary flex-1">
            Download Full Backup (JSON)
          </button>
          <button @click="downloadTemplate" class="btn btn-secondary flex-1">
            Import Template (CSV)
          </button>
        </div>

        <div>
          <label class="label">Import Transactions (CSV)</label>
          <div class="flex flex-col sm:flex-row gap-3">
            <input
              ref="importInput"
              type="file"
              accept=".csv"
              class="input"
              @change="importTransactions"
            />
          </div>
          <div
            v-if="importResult"
            class="mt-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-sm"
          >
            <p class="text-gray-800 dark:text-white">
              Imported {{ importResult.imported }} record(s)
            </p>
            <ul
              v-if="importResult.errors.length > 0"
              class="text-red-500 mt-1 list-disc list-inside"
            >
              <li v-for="(err, i) in importResult.errors" :key="i">{{ err }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Security Section -->
      <div class="card p-6">
        <h2
          class="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            ></path>
          </svg>
          Security
        </h2>

        <div class="mb-6">
          <h3 class="font-medium text-gray-800 dark:text-white mb-2">
            Two-Factor Authentication
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Protect your account with an authenticator app.
          </p>
          <div v-if="!twofa.showSetup" class="flex flex-col sm:flex-row gap-3">
            <button @click="enable2FA" class="btn btn-secondary">
              Set Up 2FA
            </button>
            <button @click="disable2FA" class="btn btn-ghost">
              Disable 2FA
            </button>
          </div>
          <div v-else class="space-y-3">
            <img
              v-if="twofa.qrCode"
              :src="twofa.qrCode"
              alt="2FA QR code"
              class="w-48 h-48 rounded-xl border border-gray-200 dark:border-gray-700"
            />
            <p
              v-if="twofa.secret"
              class="text-xs font-mono text-gray-500 dark:text-gray-400 break-all"
            >
              {{ twofa.secret }}
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <input
                v-model="twofa.code"
                type="text"
                inputmode="numeric"
                class="input sm:max-w-xs"
                placeholder="Enter 6-digit code"
              />
              <button @click="verify2FA" class="btn btn-primary">Verify</button>
              <button @click="twofa.showSetup = false" class="btn btn-ghost">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium text-gray-800 dark:text-white">
              Sessions & Devices
            </h3>
            <button
              v-if="otherSessions.length > 0"
              @click="revokeOtherSessions"
              class="btn btn-ghost text-red-500 text-sm"
            >
              Revoke Others
            </button>
          </div>
          <div
            v-if="!currentSession && otherSessions.length === 0"
            class="text-sm text-gray-500 dark:text-gray-400"
          >
            No active sessions recorded.
          </div>
          <div v-else class="space-y-2">
            <div
              v-if="currentSession"
              class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
            >
              <div>
                <p class="text-sm font-medium text-gray-800 dark:text-white">
                  {{ currentSession.deviceInfo || 'Current session' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ currentSession.ipAddress || '' }}
                </p>
              </div>
              <span class="badge badge-success">Current</span>
            </div>
            <div
              v-for="session in otherSessions"
              :key="session.id"
              class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
            >
              <div>
                <p class="text-sm font-medium text-gray-800 dark:text-white">
                  {{ session.deviceInfo || 'Unknown device' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ session.ipAddress || '' }}
                </p>
              </div>
              <button
                @click="revokeSession(session.id)"
                class="btn btn-ghost text-red-500 text-sm"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Account Section -->
      <div class="card p-6 border-red-200">
        <h2
          class="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          Danger Zone
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
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
import { defineComponent, ref, reactive, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useThemeStore } from "../stores/themeStore";
import { toast } from "../components/Toast.vue";
import { confirm } from "../components/ConfirmModal.vue";
import axios from "axios";

const API_URL = "http://localhost:3001/api";

export default defineComponent({
  name: "SettingsView",
  setup() {
    const authStore = useAuthStore();
    const themeStore = useThemeStore();
    const avatarInput = ref<HTMLInputElement | null>(null);
    const savingProfile = ref(false);
    const savingPassword = ref(false);
    const customColor = ref(themeStore.accentColor);
    const importInput = ref<HTMLInputElement | null>(null);
    const importResult = ref<{ imported: number; errors: string[] } | null>(null);
    const currentSession = ref<any | null>(null);
    const otherSessions = ref<any[]>([]);

    const exportForm = reactive({
      type: 'expense',
      format: 'csv'
    });

    const twofa = reactive({
      showSetup: false,
      qrCode: '',
      secret: '',
      code: ''
    });

    const form = reactive({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      contactNo: "",
      avatar: "" as string | null,
    });

    const passwordForm = reactive({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    const initials = computed(() => {
      if (!form.firstName || !form.lastName) return "?";
      return `${form.firstName[0]}${form.lastName[0]}`.toUpperCase();
    });

    onMounted(() => {
      if (authStore.user) {
        form.firstName = authStore.user.firstName || "";
        form.middleName = authStore.user.middleName || "";
        form.lastName = authStore.user.lastName || "";
        form.email = authStore.user.email || "";
        form.contactNo = authStore.user.contactNo
          ? String(authStore.user.contactNo)
          : "";
        form.avatar = authStore.user.avatar || null;
      }
      fetchDevices();
    });

    const triggerAvatarUpload = () => {
      avatarInput.value?.click();
    };

    const handleAvatarChange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/users/avatar`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        form.avatar = response.data.avatar;
        if (authStore.user) {
          authStore.user.avatar = response.data.avatar;
        }
        toast.success("Avatar updated successfully");
      } catch (error) {
        toast.error("Failed to update avatar");
      }
    };

    const updateProfile = async () => {
      savingProfile.value = true;
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `${API_URL}/users/profile`,
          {
            firstName: form.firstName,
            middleName: form.middleName,
            lastName: form.lastName,
            email: form.email,
            contactNo: parseInt(form.contactNo),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (authStore.user) {
          authStore.user.firstName = form.firstName;
          authStore.user.middleName = form.middleName;
          authStore.user.lastName = form.lastName;
          authStore.user.email = form.email;
          authStore.user.contactNo = parseInt(form.contactNo);
        }
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error("Failed to update profile");
      } finally {
        savingProfile.value = false;
      }
    };

    const changePassword = async () => {
      if (
        !passwordForm.currentPassword ||
        !passwordForm.newPassword ||
        !passwordForm.confirmPassword
      ) {
        toast.error("Please fill in all password fields");
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      savingPassword.value = true;
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `${API_URL}/users/password`,
          {
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        passwordForm.currentPassword = "";
        passwordForm.newPassword = "";
        passwordForm.confirmPassword = "";
        toast.success("Password updated successfully");
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to change password");
      } finally {
        savingPassword.value = false;
      }
    };

    const confirmDeleteAccount = async () => {
      const ok = await confirm({
        title: "Delete Account",
        content:
          "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.",
        type: "danger",
        confirmText: "Delete",
        cancelText: "Cancel",
      });

      if (ok) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`${API_URL}/users/account`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          localStorage.removeItem("token");
          window.location.href = "/login";
        } catch (error) {
          toast.error("Failed to delete account");
        }
      }
    };

    const selectColor = (color: string) => {
      if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
        themeStore.setAccentColor(color);
        customColor.value = color;
      }
    };

    const resetColor = () => {
      themeStore.resetAccentColor();
      customColor.value = themeStore.accentColor;
      toast.success("Theme color reset to default");
    };

    const authHeaders = () => ({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    const downloadBlob = (content: BlobPart, filename: string, mime: string) => {
      const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    };

    const todayStamp = () => new Date().toISOString().split("T")[0];

    const exportTransactions = async () => {
      try {
        if (exportForm.format === "csv") {
          const response = await axios.get(`${API_URL}/export/transactions`, {
            params: { type: exportForm.type, format: "csv" },
            headers: authHeaders(),
            responseType: "blob",
          });
          downloadBlob(response.data, `transactions_${exportForm.type}_${todayStamp()}.csv`, "text/csv");
        } else {
          const response = await axios.get(`${API_URL}/export/transactions`, {
            params: { type: exportForm.type },
            headers: authHeaders(),
          });
          downloadBlob(
            JSON.stringify(response.data.data || response.data, null, 2),
            `transactions_${exportForm.type}_${todayStamp()}.json`,
            "application/json",
          );
        }
        toast.success("Export downloaded");
      } catch (error) {
        toast.error("Failed to export transactions");
      }
    };

    const exportFullData = async () => {
      try {
        const response = await axios.get(`${API_URL}/export/full-data`, {
          params: { format: "json" },
          headers: authHeaders(),
        });
        const payload = response.data.data || response.data;
        downloadBlob(
          JSON.stringify(payload, null, 2),
          `finance_tracker_export_${todayStamp()}.json`,
          "application/json",
        );
        toast.success("Backup downloaded");
      } catch (error) {
        toast.error("Failed to export backup");
      }
    };

    const downloadTemplate = async () => {
      try {
        const response = await axios.get(`${API_URL}/import/template`, {
          headers: authHeaders(),
          responseType: "blob",
        });
        downloadBlob(response.data, "import_template.csv", "text/csv");
      } catch (error) {
        toast.error("Failed to download template");
      }
    };

    const importTransactions = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/import/transactions`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        importResult.value = response.data.data;
        toast.success(`Imported ${response.data.data.imported} record(s)`);
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to import file");
      } finally {
        if (importInput.value) importInput.value.value = "";
      }
    };

    const enable2FA = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/security/2fa/enable`,
          {},
          { headers: authHeaders() },
        );
        twofa.qrCode = response.data.data.qrCode;
        twofa.secret = response.data.data.secret;
        twofa.code = "";
        twofa.showSetup = true;
      } catch (error) {
        toast.error("Failed to start 2FA setup");
      }
    };

    const verify2FA = async () => {
      if (!twofa.code) {
        toast.error("Enter the code from your authenticator app");
        return;
      }
      try {
        await axios.post(
          `${API_URL}/security/2fa/verify`,
          { code: twofa.code },
          { headers: authHeaders() },
        );
        twofa.showSetup = false;
        twofa.qrCode = "";
        twofa.secret = "";
        twofa.code = "";
        toast.success("Two-factor authentication enabled");
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Invalid code");
      }
    };

    const disable2FA = async () => {
      const ok = await confirm({
        title: "Disable 2FA",
        content: "Are you sure you want to disable two-factor authentication?",
        confirmText: "Disable",
      });
      if (!ok) return;
      try {
        await axios.post(
          `${API_URL}/security/2fa/disable`,
          {},
          { headers: authHeaders() },
        );
        toast.success("Two-factor authentication disabled");
      } catch (error) {
        toast.error("Failed to disable 2FA");
      }
    };

    const fetchDevices = async () => {
      try {
        const response = await axios.get(`${API_URL}/security/devices`, {
          headers: authHeaders(),
        });
        currentSession.value = response.data.data.current || null;
        otherSessions.value = response.data.data.others || [];
      } catch (error) {
        currentSession.value = null;
        otherSessions.value = [];
      }
    };

    const revokeSession = async (id: number) => {      const ok = await confirm({
        title: "Revoke Session",
        content: "Are you sure you want to revoke this session?",
        confirmText: "Revoke",
      });
      if (!ok) return;
      try {
        await axios.delete(`${API_URL}/security/sessions/${id}`, {
          headers: authHeaders(),
        });
        otherSessions.value = otherSessions.value.filter((s) => s.id !== id);
        toast.success("Session revoked");
      } catch (error) {
        toast.error("Failed to revoke session");
      }
    };

    const revokeOtherSessions = async () => {
      const ok = await confirm({
        title: "Revoke Other Sessions",
        content:
          "Are you sure you want to sign out all other sessions? This will not affect your current session.",
        confirmText: "Revoke",
      });
      if (!ok) return;
      try {
        await axios.delete(`${API_URL}/security/sessions/other`, {
          headers: authHeaders(),
        });
        otherSessions.value = [];
        toast.success("Other sessions revoked");
      } catch (error) {
        toast.error("Failed to revoke other sessions");
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
      confirmDeleteAccount,
      themeStore,
      customColor,
      selectColor,
      resetColor,
      exportForm,
      importInput,
      importResult,
      exportTransactions,
      exportFullData,
      downloadTemplate,
      importTransactions,
      twofa,
      enable2FA,
      verify2FA,
      disable2FA,
      currentSession,
      otherSessions,
      revokeSession,
      revokeOtherSessions,
    };
  },
});
</script>
