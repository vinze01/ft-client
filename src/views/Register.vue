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
              Start your journey to<br />
              financial freedom
            </h1>
            <p class="text-white/80 text-lg mb-8">
              Create your account and take control today
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
          <div class="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-brand-800 dark:text-white mb-2">
                Create account
              </h2>
              <p class="text-brand-400 dark:text-gray-400">Fill in your details to get started</p>
            </div>

            <form @submit.prevent="handleRegister" class="space-y-4">
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="label">First Name</label>
                  <input
                    v-model="formState.firstName"
                    type="text"
                    class="input"
                    placeholder="First"
                  />
                </div>
                <div>
                  <label class="label">Middle (Optional)</label>
                  <input
                    v-model="formState.middleName"
                    type="text"
                    class="input"
                    placeholder="Middle"
                  />
                </div>
                <div>
                  <label class="label">Last Name</label>
                  <input
                    v-model="formState.lastName"
                    type="text"
                    class="input"
                    placeholder="Last"
                  />
                </div>
              </div>

              <div>
                <label class="label">Username</label>
                <input
                  v-model="formState.username"
                  type="text"
                  class="input"
                  placeholder="Username"
                />
              </div>

              <div>
                <label class="label">Email</label>
                <input
                  v-model="formState.email"
                  type="email"
                  class="input"
                  placeholder="Email"
                />
              </div>

              <div>
                <label class="label">Password</label>
                <input
                  v-model="formState.password"
                  type="password"
                  class="input"
                  placeholder="Password (min 6 chars)"
                />
              </div>

              <div>
                <label class="label">Contact No</label>
                <input
                  v-model="formState.contactNo"
                  type="tel"
                  class="input"
                  placeholder="Contact number"
                />
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="btn btn-primary w-full h-12 text-base mt-2"
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
                <span v-else>Create Account</span>
              </button>
            </form>

            <p class="mt-6 text-center text-brand-500 dark:text-gray-400">
              Already have an account?
              <router-link
                to="/login"
                class="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300 ml-1"
              >
                Sign in
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "../components/Toast.vue";
import { useAuthStore } from "../stores/authStore";

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
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const loading = ref(false);

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

    return { formState, loading, handleRegister, isDark, toggleTheme };
  },
});
</script>
