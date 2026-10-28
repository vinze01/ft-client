<template>
  <AuthLayout
    headline="Start tracking in minutes."
    description="Create your account to organize your income, expenses, and budgets in one place."
  >
    <div class="mb-6">
      <h2
        class="text-2xl font-semibold tracking-tight"
        style="color: var(--text-primary)"
      >
        Create account
      </h2>
      <p class="text-sm mt-1" style="color: var(--text-secondary)">
        Fill in your details to get started.
      </p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="label" for="reg-first-name">First Name</label>
          <input
            id="reg-first-name"
            v-model="formState.firstName"
            type="text"
            class="input"
            placeholder="First"
            autocomplete="given-name"
          />
        </div>
        <div>
          <label class="label" for="reg-middle-name">Middle (Optional)</label>
          <input
            id="reg-middle-name"
            v-model="formState.middleName"
            type="text"
            class="input"
            placeholder="Middle"
            autocomplete="additional-name"
          />
        </div>
        <div>
          <label class="label" for="reg-last-name">Last Name</label>
          <input
            id="reg-last-name"
            v-model="formState.lastName"
            type="text"
            class="input"
            placeholder="Last"
            autocomplete="family-name"
          />
        </div>
      </div>

      <div>
        <label class="label" for="reg-username">Username</label>
        <input
          id="reg-username"
          v-model="formState.username"
          type="text"
          class="input"
          placeholder="Username"
          autocomplete="username"
        />
      </div>

      <div>
        <label class="label" for="reg-email">Email</label>
        <input
          id="reg-email"
          v-model="formState.email"
          type="email"
          class="input"
          placeholder="Email"
          autocomplete="email"
        />
      </div>

      <div>
        <label class="label" for="reg-password">Password</label>
        <input
          id="reg-password"
          v-model="formState.password"
          type="password"
          class="input"
          placeholder="At least 6 characters"
          autocomplete="new-password"
        />
      </div>

      <div>
        <label class="label" for="reg-contact">Contact No</label>
        <input
          id="reg-contact"
          v-model="formState.contactNo"
          type="tel"
          class="input"
          placeholder="Contact number"
          autocomplete="tel"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="btn btn-primary w-full !py-2.5 mt-2"
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
        <span v-else>Create Account</span>
      </button>
    </form>

    <p class="mt-6 text-center text-sm" style="color: var(--text-secondary)">
      Already have an account?
      <router-link
        to="/login"
        class="font-medium hover:underline"
        style="color: var(--accent-color)"
        >Sign in</router-link
      >
    </p>
  </AuthLayout>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "../components/Toast.vue";
import { useAuthStore } from "../stores/authStore";
import AuthLayout from "../components/AuthLayout.vue";

interface FormState {
  username: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  contactNo: number | string;
  email: string;
}

export default defineComponent({
  name: "RegisterView",
  components: { AuthLayout },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const loading = ref(false);

    const formState = reactive<FormState>({
      username: "",
      password: "",
      firstName: "",
      middleName: "",
      lastName: "",
      contactNo: "",
      email: "",
    });

    const handleRegister = async () => {
      loading.value = true;
      try {
        const formData = new FormData();
        Object.keys(formState).forEach((key) => {
          if (formState[key as keyof FormState]) {
            formData.append(key, String(formState[key as keyof FormState]));
          }
        });
        await authStore.register(formData);
        toast.success("Account created! Please login.");
        router.push("/login");
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Registration failed");
      } finally {
        loading.value = false;
      }
    };

    return { formState, loading, handleRegister };
  },
});
</script>
