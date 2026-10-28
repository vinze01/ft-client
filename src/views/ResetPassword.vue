<template>
  <AuthLayout
    headline="Set a new password."
    description="Choose a strong password you haven't used elsewhere."
    :features="[]"
  >
    <div class="mb-8">
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
        :style="{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-color)' }"
        aria-hidden="true"
      >
        <component :is="KeyIcon" class="w-5 h-5" />
      </div>
      <h2
        class="text-2xl font-semibold tracking-tight"
        style="color: var(--text-primary)"
      >
        Reset Password
      </h2>
      <p class="text-sm mt-1" style="color: var(--text-secondary)">
        Enter your new password below.
      </p>
    </div>

    <div v-if="!tokenValid" class="card p-6 text-center">
      <p class="text-sm" style="color: var(--expense)">
        Invalid or expired reset token.
      </p>
      <router-link
        to="/login"
        class="btn btn-secondary btn-sm mt-4 inline-flex"
        >Back to Login</router-link
      >
    </div>

    <form v-else @submit.prevent="handleResetPassword" class="space-y-4">
      <div>
        <label class="label" for="reset-password">New Password</label>
        <div class="relative">
          <input
            id="reset-password"
            v-model="newPassword"
            :type="showPassword ? 'text' : 'password'"
            class="input pr-11"
            placeholder="Enter new password"
            autocomplete="new-password"
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

      <div>
        <label class="label" for="reset-confirm">Confirm New Password</label>
        <input
          id="reset-confirm"
          v-model="confirmPassword"
          :type="showPassword ? 'text' : 'password'"
          class="input"
          placeholder="Confirm new password"
          autocomplete="new-password"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="btn btn-primary w-full !py-2.5"
      >
        {{ loading ? "Resetting..." : "Reset Password" }}
      </button>

      <p class="text-center text-sm">
        <router-link
          to="/login"
          class="hover:underline"
          style="color: var(--text-secondary)"
          >Back to Login</router-link
        >
      </p>
    </form>
  </AuthLayout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toast } from "../components/Toast.vue";
import AuthLayout from "../components/AuthLayout.vue";
import { EyeIcon, EyeOffIcon, KeyIcon } from "../components/icons";

export default defineComponent({
  name: "ResetPasswordView",
  components: { AuthLayout },
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
      EyeIcon,
      EyeOffIcon,
      KeyIcon,
    };
  },
});
</script>
