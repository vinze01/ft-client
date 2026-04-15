<template>
  <nav
    class="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <router-link to="/dashboard" class="flex items-center gap-2">
            <img
              src="/assets/ft-logo.png"
              alt="FinanceTracker"
              class="w-9 h-9 rounded-lg object-cover"
            />
            <span class="text-lg font-bold text-gray-800 dark:text-white"
              >FinanceTracker</span
            >
          </router-link>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-1">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="px-3 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center gap-2"
            :class="[
              $route.path === item.path
                ? 'text-[var(--accent-color)] bg-[var(--accent-50)] dark:bg-[var(--accent-900)]'
                : 'text-gray-600 dark:text-white hover:text-[var(--accent-color)] hover:bg-[var(--accent-50)] dark:hover:bg-[var(--accent-900)]',
            ]"
          >
            <component :is="item.icon" class="w-4 h-4" />
            {{ item.label }}
          </router-link>
        </div>

        <!-- Right Side -->
        <div class="flex items-center gap-3">
          <!-- Theme Toggle -->
          <button
            @click="themeStore.toggle()"
            class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200"
            :title="
              themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'
            "
          >
            <svg
              v-if="themeStore.isDark"
              class="w-5 h-5"
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
              class="w-5 h-5"
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

          <!-- User Menu -->
          <div class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200"
            >
              <img
                v-if="authStore.user?.avatar"
                :src="authStore.user.avatar"
                class="w-8 h-8 rounded-full object-cover"
              />
              <div
                v-else
                class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                :style="{
                  background: `linear-gradient(135deg, var(--accent-color), var(--accent-700))`,
                }"
              >
                {{ initials }}
              </div>
              <span
                class="hidden sm:block text-sm font-medium"
                :class="
                  themeStore.isDark
                    ? 'text-[var(--accent-color)]'
                    : 'text-gray-700 dark:text-gray-200'
                "
                >{{ authStore.user.username }}</span
              >
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            <!-- Dropdown -->
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-50"
              >
                <div
                  class="px-4 py-3 border-b border-gray-100 dark:border-gray-700"
                >
                  <p class="text-sm font-medium text-gray-800 dark:text-white">
                    {{ fullName }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ userEmail }}
                  </p>
                </div>
                <router-link
                  to="/settings"
                  class="px-4 py-2 text-sm flex items-center gap-2 transition duration-150"
                  :class="
                    themeStore.isDark
                      ? 'text-[var(--accent-color)] hover:bg-[var(--accent-900)]'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  "
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  Settings
                </router-link>
                <button
                  @click="handleLogout"
                  class="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition duration-150"
                  :class="
                    themeStore.isDark
                      ? 'text-[var(--accent-color)] hover:bg-[var(--accent-900)]'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  "
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    ></path>
                  </svg>
                  Sign Out
                </button>
              </div>
            </transition>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200"
          >
            <svg
              v-if="!showMobileMenu"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
            <svg
              v-else
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
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="showMobileMenu"
        class="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
      >
        <div class="px-4 py-3 space-y-2">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="showMobileMenu = false"
            class="block px-4 py-3 rounded-lg text-sm font-medium transition duration-200 flex items-center gap-3"
            :class="[
              $route.path === item.path
                ? 'text-[var(--accent-color)] bg-[var(--accent-50)] dark:bg-[var(--accent-900)]'
                : 'text-gray-600 dark:text-white hover:text-[var(--accent-color)] hover:bg-[var(--accent-50)] dark:hover:bg-[var(--accent-900)]',
            ]"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.label }}
          </router-link>
          <button
            @click="handleLogout"
            class="w-full block px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition duration-200 flex items-center gap-3"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, h } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { useThemeStore } from "../stores/themeStore";

// Icon components
const HomeIcon = {
  render: () =>
    h(
      "svg",
      {
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        "stroke-width": "2",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
        }),
      ],
    ),
};

const ArrowUpIcon = {
  render: () =>
    h(
      "svg",
      {
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        "stroke-width": "2",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M5 10l7-7m0 0l7 7m-7-7v18",
        }),
      ],
    ),
};

const ArrowDownIcon = {
  render: () =>
    h(
      "svg",
      {
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        "stroke-width": "2",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M19 14l-7 7m0 0l-7-7m7 7V3",
        }),
      ],
    ),
};

const WalletIcon = {
  render: () =>
    h(
      "svg",
      {
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        "stroke-width": "2",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
        }),
      ],
    ),
};

const SettingsIcon = {
  render: () =>
    h(
      "svg",
      {
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        "stroke-width": "2",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
        }),
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
        }),
      ],
    ),
};

export default defineComponent({
  name: "Navbar",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();
    const themeStore = useThemeStore();
    const showUserMenu = ref(false);
    const showMobileMenu = ref(false);

    const navItems = [
      {
        name: "dashboard",
        label: "Dashboard",
        path: "/dashboard",
        icon: HomeIcon,
      },
      { name: "incomes", label: "Income", path: "/incomes", icon: ArrowUpIcon },
      {
        name: "expenses",
        label: "Expenses",
        path: "/expenses",
        icon: ArrowDownIcon,
      },
      { name: "budgets", label: "Budgets", path: "/budgets", icon: WalletIcon },
      {
        name: "settings",
        label: "Settings",
        path: "/settings",
        icon: SettingsIcon,
      },
    ];

    watch(
      () => route.path,
      () => {
        showUserMenu.value = false;
        showMobileMenu.value = false;
      },
    );

    const handleLogout = () => {
      localStorage.setItem("accentColor", "#6366f1");
      authStore.logout();
      router.push("/login");
    };

    const fullName = computed(() => {
      if (!authStore.user) return "Guest";
      return `${authStore.user.firstName} ${authStore.user.lastName}`;
    });

    const initials = computed(() => {
      if (!authStore.user) return "G";
      return `${authStore.user.firstName[0]}${authStore.user.lastName[0]}`.toUpperCase();
    });

    const userEmail = computed(() => {
      return authStore.user?.email || "";
    });

    return {
      authStore,
      themeStore,
      showUserMenu,
      showMobileMenu,
      navItems,
      handleLogout,
      fullName,
      initials,
      userEmail,
    };
  },
});
</script>
