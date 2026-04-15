<template>
  <div
    class="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 sm:p-8"
  >
    <!-- Theme Toggle -->
    <button
      @click="toggleTheme"
      class="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all z-50"
      :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <svg
        v-if="isDark"
        class="w-5 h-5 text-brand-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        ></path>
      </svg>
      <svg
        v-else
        class="w-5 h-5 text-brand-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        ></path>
      </svg>
    </button>

    <div class="w-full max-w-5xl animate-fade-in">
      <div
        class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]"
      >
        <!-- Left Panel - Branding -->
        <div
          class="lg:w-2/5 bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 p-8 sm:p-12 flex flex-col justify-center relative overflow-hidden"
        >
          <!-- Decorative elements -->
          <div
            class="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          ></div>
          <div
            class="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"
          ></div>
          <div
            class="absolute top-1/4 right-8 w-20 h-20 bg-white/10 rounded-full"
          ></div>
          <div
            class="absolute bottom-1/3 left-8 w-12 h-12 bg-white/10 rounded-full"
          ></div>

          <div class="relative z-10 text-white">
            <div class="flex items-center gap-3 mb-8">
              <div
                class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <span class="text-2xl font-bold">FinanceTracker</span>
            </div>

            <h1 class="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              Master your money,<br />
              own your future
            </h1>
            <p class="text-white/80 text-lg mb-8">
              Take control of your finances with powerful tracking tools
            </p>

            <div class="space-y-4">
              <div class="flex items-center gap-3 text-white/90">
                <div
                  class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"
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
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span>Track your daily expenses</span>
              </div>
              <div class="flex items-center gap-3 text-white/90">
                <div
                  class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"
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
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span>Set and manage budgets</span>
              </div>
              <div class="flex items-center gap-3 text-white/90">
                <div
                  class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"
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
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span>Monitor your income</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel - Form -->
        <div class="lg:w-3/5 p-8 sm:p-12 flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/50">
          <div class="w-full max-w-md">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-brand-800 dark:text-white mb-2">
                Welcome back
              </h2>
              <p class="text-brand-400 dark:text-gray-400">Enter your credentials to continue</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-5">
              <div>
                <label class="label">Username</label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                  >
                    <svg
                      class="w-5 h-5 text-brand-400"
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
                  </div>
                  <input
                    v-model="formState.username"
                    type="text"
                    class="input pl-12"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label class="label">Password</label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                  >
                    <svg
                      class="w-5 h-5 text-brand-400"
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
                  </div>
                  <input
                    v-model="formState.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="input pl-12 pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <svg
                      v-if="!showPassword"
                      class="w-5 h-5 text-brand-400 hover:text-brand-600"
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
                      class="w-5 h-5 text-brand-400 hover:text-brand-600"
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

              <button
                type="submit"
                :disabled="loading"
                class="btn btn-primary w-full h-12 text-base"
              >
                <svg
                  v-if="loading"
                  class="animate-spin w-5 h-5"
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
                <span v-else>Sign In</span>
              </button>
            </form>

            <div class="text-center mt-4">
              <button
                @click="showForgotPassword = true"
                class="text-sm text-brand-500 hover:text-brand-600"
              >
                Forgot your password?
              </button>
            </div>

            <p class="mt-8 text-center text-brand-500 dark:text-gray-400">
              Don't have an account?
              <router-link
                to="/register"
                class="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300 ml-1"
              >
                Create one
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Forgot Password Modal -->
  <div
    v-if="showForgotPassword"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md animate-fade-in"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-brand-800">Reset Password</h3>
        <button
          @click="showForgotPassword = false"
          class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <p v-if="!resetEmailSent" class="text-gray-600 dark:text-gray-300 mb-4">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>
      <p v-else class="text-green-600 mb-4">
        Check your email for the reset link!
      </p>

      <form v-if="!resetEmailSent" @submit.prevent="handleForgotPassword">
        <div class="mb-4">
          <label class="label">Email</label>
          <input
            v-model="forgotEmail"
            type="email"
            class="input"
            placeholder="Enter your email"
          />
        </div>

        <button
          type="submit"
          :disabled="forgotLoading"
          class="btn btn-primary w-full"
        >
          {{ forgotLoading ? "Sending..." : "Send Reset Link" }}
        </button>
      </form>

      <button
        v-if="resetEmailSent"
        @click="
          showForgotPassword = false;
          resetEmailSent = false;
        "
        class="btn btn-secondary w-full mt-4"
      >
        Back to Login
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { toast } from "../components/Toast.vue";
import { useAuthStore } from "../stores/authStore";

interface FormState {
  username: string;
  password: string;
}

export default defineComponent({
  name: "LoginView",
  setup() {
    const authStore = useAuthStore();
    const loading = ref(false);
    const showPassword = ref(false);
    const showForgotPassword = ref(false);
    const forgotEmail = ref("");
    const forgotLoading = ref(false);
    const resetEmailSent = ref(false);

    const savedTheme = localStorage.getItem("theme");
    const isDark = ref(savedTheme === "dark");

    const toggleTheme = () => {
      isDark.value = !isDark.value;
      localStorage.setItem("theme", isDark.value ? "dark" : "light");
      if (isDark.value) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    const formState = reactive<FormState>({
      username: "",
      password: "",
    });

    const handleLogin = async () => {
      if (!formState.username || !formState.password) {
        toast.error("Please enter both username and password");
        return;
      }

      loading.value = true;
      try {
        await authStore.login(formState.username, formState.password);
        toast.success("Welcome back!");
      } catch (error: any) {
        toast.error(
          error.response?.data?.error || "Login failed. Please try again.",
        );
      } finally {
        loading.value = false;
      }
    };

    const handleForgotPassword = async () => {
      if (!forgotEmail.value) {
        toast.error("Please enter your email");
        return;
      }

      forgotLoading.value = true;
      try {
        await fetch("http://localhost:3001/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail.value }),
        });
        resetEmailSent.value = true;
        toast.success("Reset link sent to your email");
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to send reset link");
      } finally {
        forgotLoading.value = false;
      }
    };

    return {
      formState,
      loading,
      showPassword,
      showForgotPassword,
      forgotEmail,
      forgotLoading,
      resetEmailSent,
      isDark,
      toggleTheme,
      handleLogin,
      handleForgotPassword,
    };
  },
});
</script>
