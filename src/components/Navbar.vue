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

        <!-- Desktop / Tablet Menu -->
        <div class="hidden md:flex items-center gap-1">
          <div
            v-for="group in groupedNav"
            :key="group.name"
            class="relative group"
          >
            <button
              class="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition duration-200"
              :class="[
                isGroupActive(group)
                  ? 'bg-[var(--accent-color)] text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 group-hover:text-[var(--accent-color)] group-hover:bg-[var(--accent-50)] dark:group-hover:bg-[var(--accent-50)] dark:group-hover:text-white',
              ]"
            >
              {{ group.name }}
              <svg class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div
              class="absolute left-0 top-full pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-150 z-50"
            >
              <div
                class="w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1"
              >
                <router-link
                  v-for="item in group.items"
                  :key="item.path"
                  :to="item.path"
                  class="px-4 py-2 text-sm flex items-center gap-3 transition duration-150"
                  :class="[
                    $route.path === item.path
                      ? 'bg-[var(--accent-color)] text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  ]"
                >
                  <component :is="item.icon" class="w-4 h-4" />
                  {{ item.label }}
                </router-link>
              </div>
            </div>
          </div>
          <router-link
            to="/settings"
            class="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition duration-200 whitespace-nowrap"
            :class="[
              $route.path === '/settings'
                ? 'bg-[var(--accent-color)] text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-[var(--accent-color)] hover:bg-[var(--accent-50)] dark:hover:bg-[var(--accent-50)] dark:hover:text-white',
            ]"
          >
            <component :is="SettingsIcon" class="w-4 h-4" />
            Settings
          </router-link>
        </div>

        <!-- Right Side -->
        <div class="flex items-center gap-3">
          <!-- Notifications -->
          <router-link
            to="/notifications"
            class="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200"
            title="Notifications"
          >
            <component :is="BellIcon" class="w-5 h-5" />
            <span
              v-if="notificationStore.unreadCount > 0"
              class="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-red-500 text-white text-[0.65rem] font-bold flex items-center justify-center"
            >
              {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
            </span>
          </router-link>
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
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate" :title="userEmail">
                    {{ userEmail }}
                  </p>
                </div>
                <router-link
                  to="/settings"
                  class="px-4 py-2 text-sm flex items-center gap-2 transition duration-150"
                  :class="
                    themeStore.isDark
                      ? 'text-[var(--accent-color)] dark:text-white hover:bg-[var(--accent-50)]'
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
                      ? 'text-[var(--accent-color)] dark:text-white hover:bg-[var(--accent-50)]'
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
          <div v-for="group in groupedNav" :key="group.name">
            <button
              @click="toggleMobileGroup(group.name)"
              class="w-full px-4 py-3 rounded-lg text-sm font-medium transition duration-200 flex items-center justify-between"
              :class="[
                isGroupActive(group)
                  ? 'bg-[var(--accent-color)] text-white shadow-sm'
                  : 'text-gray-600 dark:text-white hover:text-[var(--accent-color)] hover:bg-[var(--accent-50)] dark:hover:bg-[var(--accent-50)] dark:hover:text-white',
              ]"
            >
              {{ group.name }}
              <svg
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': openMobileGroup === group.name }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div v-if="openMobileGroup === group.name" class="pl-3 space-y-1 mt-1">
              <router-link
                v-for="item in group.items"
                :key="item.path"
                :to="item.path"
                @click="showMobileMenu = false"
                class="block px-4 py-2.5 rounded-lg text-sm font-medium transition duration-200 flex items-center gap-3"
                :class="[
                  $route.path === item.path
                    ? 'bg-[var(--accent-color)] text-white shadow-sm'
                    : 'text-gray-600 dark:text-white hover:text-[var(--accent-color)] hover:bg-[var(--accent-50)] dark:hover:bg-[var(--accent-50)] dark:hover:text-white',
                ]"
              >
                <component :is="item.icon" class="w-5 h-5" />
                {{ item.label }}
              </router-link>
            </div>
          </div>
          <router-link
            to="/settings"
            @click="showMobileMenu = false"
            class="block px-4 py-3 rounded-lg text-sm font-medium transition duration-200 flex items-center gap-3"
            :class="[
              $route.path === '/settings'
                ? 'bg-[var(--accent-color)] text-white shadow-sm'
                : 'text-gray-600 dark:text-white hover:text-[var(--accent-color)] hover:bg-[var(--accent-50)] dark:hover:bg-[var(--accent-50)] dark:hover:text-white',
            ]"
          >
            <component :is="SettingsIcon" class="w-5 h-5" />
            Settings
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
import { defineComponent, ref, computed, watch, h, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { useThemeStore } from "../stores/themeStore";
import { useNotificationStore } from "../stores/notificationStore";

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
    const route = useRoute();
    const authStore = useAuthStore();
    const themeStore = useThemeStore();
    const notificationStore = useNotificationStore();
    const showUserMenu = ref(false);
    const showMobileMenu = ref(false);
    const openMobileGroup = ref<string | null>(null);

    const CreditCardIcon = {
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

const CalendarIcon = {
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
          d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
        }),
      ],
    ),
};

const TargetIcon = {
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
          d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        }),
      ],
    ),
};

const RepeatIcon = {
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
          d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
        }),
      ],
    ),
};

const ChartIcon = {
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
          d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        }),
      ],
    ),
};

const TagIcon = {
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
          d: "M7 7h.01M7 3h5.586a1 1 0 01.707.293l7.414 7.414a1 1 0 010 1.414l-5.414 5.414a1 1 0 01-1.414 0L5.879 10.12a1 1 0 01-.293-.707V4a1 1 0 011-1z",
        }),
      ],
    ),
};

const SavingsIcon = {
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
          d: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z",
        }),
      ],
    ),
};

const AutomationIcon = {
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
          d: "M13 10V3L4 14h7v7l9-11h-7z",
        }),
      ],
    ),
};

const BellIcon = {
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
          d: "M15 17h5l-1.405-1.405A2.003 2.003 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
        }),
      ],
    ),
};

const navItems = [
      { name: "dashboard", label: "Dashboard", path: "/dashboard", icon: HomeIcon },
      { name: "incomes", label: "Income", path: "/incomes", icon: ArrowUpIcon },
      { name: "expenses", label: "Expenses", path: "/expenses", icon: ArrowDownIcon },
      { name: "budgets", label: "Budgets", path: "/budgets", icon: WalletIcon },
      { name: "accounts", label: "Accounts", path: "/accounts", icon: CreditCardIcon },
      { name: "bills", label: "Bills", path: "/bills", icon: CalendarIcon },
      { name: "goals", label: "Goals", path: "/goals", icon: TargetIcon },
      { name: "recurring", label: "Recurring", path: "/recurring", icon: RepeatIcon },
      { name: "insights", label: "Insights", path: "/insights", icon: ChartIcon },
      { name: "tags", label: "Tags", path: "/tags", icon: TagIcon },
      { name: "savings", label: "Savings", path: "/savings", icon: SavingsIcon },
      { name: "automations", label: "Automations", path: "/automations", icon: AutomationIcon },
      { name: "notifications", label: "Notifications", path: "/notifications", icon: BellIcon },
      { name: "settings", label: "Settings", path: "/settings", icon: SettingsIcon },
    ];

    watch(
      () => route.path,
      () => {
        showUserMenu.value = false;
        showMobileMenu.value = false;
      },
    );

    const toggleMobileGroup = (name: string) => {
      openMobileGroup.value = openMobileGroup.value === name ? null : name;
    };

    const navGroups = [
      { name: "Overview", items: ["dashboard", "insights"] },
      { name: "Money", items: ["incomes", "expenses", "budgets", "accounts"] },
      { name: "Plans", items: ["bills", "goals", "savings", "recurring"] },
      { name: "Tools", items: ["tags", "automations", "notifications"] },
    ];

    const groupedNav = computed(() =>
      navGroups.map((group) => ({
        name: group.name,
        items: navItems.filter((item) => group.items.includes(item.name)),
      })),
    );

    const isGroupActive = (group: { items: { path: string }[] }) =>
      group.items.some((item) => item.path === route.path);

    const refreshUnreadCount = () => {
      if (authStore.isAuthenticated) {
        notificationStore.fetchUnreadCount().catch(() => {});
      }
    };

    onMounted(refreshUnreadCount);

    watch(() => route.path, refreshUnreadCount);

    const handleLogout = () => {
      localStorage.setItem("accentColor", "#6366f1");
      authStore.logout();
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
      notificationStore,
      BellIcon,
      SettingsIcon,
      showUserMenu,
      showMobileMenu,
      openMobileGroup,
      toggleMobileGroup,
      navItems,
      groupedNav,
      isGroupActive,
      handleLogout,
      fullName,
      initials,
      userEmail,
    };
  },
});
</script>
