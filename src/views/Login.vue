<template>
  <AuthLayout
    headline="Your finances, clearly organized."
    description="Track spending, manage budgets, and build better financial habits in one place."
  >
    <div class="mb-8">
      <h2
        class="text-2xl font-semibold tracking-tight"
        style="color: var(--text-primary)"
      >
        Welcome back
      </h2>
      <p class="text-sm mt-1" style="color: var(--text-secondary)">
        Sign in to continue to your dashboard.
      </p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="label" for="login-username">Username</label>
        <input
          id="login-username"
          v-model="formState.username"
          type="text"
          class="input"
          placeholder="Enter your username"
          autocomplete="username"
        />
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label class="label" for="login-password">Password</label>
          <button
            type="button"
            class="text-[13px] mb-1.5 hover:underline"
            style="color: var(--accent-color)"
            @click="showForgotPassword = true"
          >
            Forgot password?
          </button>
        </div>
        <div class="relative">
          <input
            id="login-password"
            v-model="formState.password"
            :type="showPassword ? 'text' : 'password'"
            class="input pr-11"
            placeholder="Enter your password"
            autocomplete="current-password"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            @click="showPassword = !showPassword"
          >
            <component
              :is="showPassword ? EyeOffIcon : EyeIcon"
              class="w-[18px] h-[18px]"
              style="color: var(--text-muted)"
            />
          </button>
        </div>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="btn btn-primary w-full !py-2.5"
      >
        <svg
          v-if="loading"
          class="animate-spin w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
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

    <p class="mt-6 text-center text-sm" style="color: var(--text-secondary)">
      Don't have an account?
      <router-link
        to="/register"
        class="font-medium hover:underline"
        style="color: var(--accent-color)"
        >Create one</router-link
      >
    </p>

    <!-- Forgot Password Modal -->
    <div
      v-if="showForgotPassword"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showForgotPassword = false"
    >
      <div
        class="modal-content !max-w-md animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-title"
      >
        <div class="modal-header">
          <h3 id="forgot-password-title" class="section-title">Reset password</h3>
          <button
            type="button"
            aria-label="Close"
            style="color: var(--text-muted)"
            @click="showForgotPassword = false"
          >
            <component :is="XIcon" class="w-5 h-5" />
          </button>
        </div>

        <div class="modal-body">
          <p v-if="!resetEmailSent" class="text-sm mb-4" style="color: var(--text-secondary)">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
          <p v-else class="text-sm mb-4" style="color: var(--income)">
            Check your email for the reset link!
          </p>

          <form v-if="!resetEmailSent" @submit.prevent="handleForgotPassword">
            <div class="mb-4">
              <label class="label" for="forgot-email">Email</label>
              <input
                id="forgot-email"
                v-model="forgotEmail"
                type="email"
                class="input"
                placeholder="Enter your email"
                autocomplete="email"
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
            type="button"
            class="btn btn-secondary w-full"
            @click="
              showForgotPassword = false;
              resetEmailSent = false;
            "
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { toast } from "../components/Toast.vue";
import { useAuthStore } from "../stores/authStore";
import AuthLayout from "../components/AuthLayout.vue";
import { EyeIcon, EyeOffIcon, XIcon } from "../components/icons";

interface FormState {
  username: string;
  password: string;
}

export default defineComponent({
  name: "LoginView",
  components: { AuthLayout },
  setup() {
    const authStore = useAuthStore();
    const loading = ref(false);
    const showPassword = ref(false);
    const showForgotPassword = ref(false);
    const forgotEmail = ref("");
    const forgotLoading = ref(false);
    const resetEmailSent = ref(false);

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
      handleLogin,
      handleForgotPassword,
      EyeIcon,
      EyeOffIcon,
      XIcon,
    };
  },
});
</script>
