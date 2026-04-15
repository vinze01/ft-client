<template>
  <div
    class="min-h-screen bg-gradient-to-br from-brand-50 dark:from-gray-900 via-white dark:via-gray-800 to-brand-100 dark:to-gray-900 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md animate-fade-in">
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
        <div class="text-center mb-8">
          <div
            class="w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-white"
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
          </div>
          <h1 class="text-2xl font-bold text-brand-800">Reset Password</h1>
          <p class="text-brand-400 mt-2">Enter your new password</p>
        </div>

        <div v-if="!tokenValid" class="text-center">
          <p class="text-red-500">Invalid or expired reset token.</p>
          <router-link
            to="/login"
            class="text-brand-600 hover:text-brand-700 mt-4 inline-block"
          >
            Back to Login
          </router-link>
        </div>

        <form v-else @submit.prevent="handleResetPassword" class="space-y-5">
          <div>
            <label class="label">New Password</label>
            <div class="relative">
              <input
                v-model="newPassword"
                :type="showPassword ? 'text' : 'password'"
                class="input pr-12"
                placeholder="Enter new password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <svg
                  v-if="!showPassword"
                  class="w-5 h-5 text-brand-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
                <svg
                  v-else
                  class="w-5 h-5 text-brand-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label class="label">Confirm New Password</label>
            <input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              class="input"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary w-full h-12"
          >
            {{ loading ? "Resetting..." : "Reset Password" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toast } from "../components/Toast.vue";

export default defineComponent({
  name: "ResetPasswordView",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const token = ref(route.query.token as string);
    const newPassword = ref("");
    const confirmPassword = ref("");
    const showPassword = ref(false);
    const loading = ref(false);
    const tokenValid = ref(true);

    onMounted(async () => {
      if (!token.value) {
        tokenValid.value = false;
        return;
      }
    });

    const handleResetPassword = async () => {
      if (!newPassword.value || !confirmPassword.value) {
        toast.error("Please enter both password fields");
        return;
      }

      if (newPassword.value !== confirmPassword.value) {
        toast.error("Passwords do not match");
        return;
      }

      if (newPassword.value.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      loading.value = true;
      try {
        await axios.post("http://localhost:3001/api/reset-password", {
          token: token.value,
          newPassword: newPassword.value,
        });
        toast.success("Password reset successfully");
        router.push("/login");
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to reset password");
      } finally {
        loading.value = false;
      }
    };

    return {
      newPassword,
      confirmPassword,
      showPassword,
      loading,
      tokenValid,
      handleResetPassword,
    };
  },
});
</script>
