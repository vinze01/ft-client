<template>
  <nav
    class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-40 md:hidden"
  >
    <div class="flex items-center justify-around py-2 px-4">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200"
        :class="[
          $route.path === item.path
            ? 'bg-[var(--accent-color)] text-white shadow-sm'
            : 'text-gray-500 dark:text-white hover:text-[var(--accent-color)] hover:bg-[var(--accent-50)] dark:hover:bg-[var(--accent-50)] dark:hover:text-white',
        ]"
      >
        <component :is="item.icon" class="w-6 h-6" />
        <span class="text-xs font-medium">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, h } from "vue";
import { useThemeStore } from "../stores/themeStore";

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
  name: "BottomNav",
  setup() {
    const themeStore = useThemeStore();
    const navItems = [
      { name: "dashboard", label: "Home", path: "/dashboard", icon: HomeIcon },
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

    return { navItems, themeStore };
  },
});
</script>
