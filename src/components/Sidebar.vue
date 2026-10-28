<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 hidden md:flex flex-col"
    :style="{
      width: collapsed ? '68px' : '240px',
      backgroundColor: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      transition: 'width 220ms ease',
    }"
  >
    <!-- Logo -->
    <div
      class="flex items-center h-16 flex-shrink-0"
      :class="collapsed ? 'justify-center' : 'px-4'"
    >
      <router-link
        to="/dashboard"
        class="flex items-center gap-2.5 min-w-0"
        title="FinanceTracker"
      >
        <img
          src="/assets/ft-logo.png"
          alt="FinanceTracker"
          class="w-8 h-8 rounded-lg object-cover flex-shrink-0"
        />
        <span
          v-if="!collapsed"
          class="text-[15px] font-semibold truncate"
          style="color: var(--text-primary)"
          >FinanceTracker</span
        >
      </router-link>
    </div>

    <!-- Grouped navigation -->
    <nav class="flex-1 overflow-y-auto px-3 py-2 space-y-5" aria-label="Main navigation">
      <div v-for="group in groups" :key="group.name">
        <p
          v-if="!collapsed"
          class="px-2 mb-1 text-[11px] font-semibold uppercase tracking-wider"
          style="color: var(--text-muted)"
        >
          {{ group.name }}
        </p>
        <ul class="space-y-0.5">
          <li v-for="item in group.items" :key="item.path">
            <router-link
              :to="item.path"
              class="relative flex items-center rounded-lg text-sm font-medium h-9"
              :class="collapsed ? 'justify-center' : 'gap-3 px-2.5'"
              :style="isActive(item.path) ? activeStyle : idleStyle"
              :title="collapsed ? item.label : undefined"
              :aria-current="isActive(item.path) ? 'page' : undefined"
            >
              <span
                v-if="isActive(item.path)"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
                style="background-color: var(--accent-color)"
                aria-hidden="true"
              ></span>
              <component :is="item.icon" class="w-[18px] h-[18px] flex-shrink-0" />
              <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Footer: user + actions -->
    <div class="p-3 flex-shrink-0" style="border-top: 1px solid var(--border)">
      <div
        class="flex items-center gap-2"
        :class="collapsed ? 'flex-col' : 'justify-between'"
      >
        <div
          class="flex items-center gap-2.5 min-w-0"
          :class="collapsed ? 'flex-col' : ''"
        >
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0"
            :style="{
              backgroundColor: 'var(--accent-100)',
              color: 'var(--accent-color)',
            }"
            aria-hidden="true"
          >
            {{ initials }}
          </div>
          <div v-if="!collapsed" class="min-w-0">
            <p
              class="text-[13px] font-medium truncate"
              style="color: var(--text-primary)"
            >
              {{ fullName }}
            </p>
            <p class="text-[11px] truncate" style="color: var(--text-muted)">
              @{{ username }}
            </p>
          </div>
        </div>
        <div v-if="!collapsed" class="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            class="p-2 rounded-lg hover:bg-[var(--expense-soft)]"
            title="Log out"
            aria-label="Log out"
            style="color: var(--text-secondary)"
            @click="logout"
          >
            <component :is="LogoutIcon" class="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      <button
        v-if="!collapsed"
        type="button"
        class="btn btn-ghost btn-sm w-full mt-3 !justify-start gap-2"
        aria-label="Collapse sidebar"
        @click="$emit('toggle')"
      >
        <component :is="ChevronsLeftIcon" class="w-4 h-4" />
        Collapse
      </button>
      <button
        v-else
        type="button"
        class="btn btn-ghost btn-sm w-full mt-3 !px-0"
        title="Expand sidebar"
        aria-label="Expand sidebar"
        @click="$emit('toggle')"
      >
        <component :is="ChevronsRightIcon" class="w-4 h-4" />
      </button>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import ThemeToggle from "./ThemeToggle.vue";
import {
  HomeIcon,
  SparklesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CreditCardIcon,
  WalletIcon,
  TargetIcon,
  CalendarIcon,
  RepeatIcon,
  ZapIcon,
  TagIcon,
  BellIcon,
  CogIcon,
  LogoutIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  PiggyIcon,
} from "./icons";

interface NavItem {
  label: string;
  path: string;
  icon: object;
}

interface NavGroup {
  name: string;
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
  {
    name: "Overview",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: HomeIcon },
      { label: "Insights", path: "/insights", icon: SparklesIcon },
    ],
  },
  {
    name: "Money",
    items: [
      { label: "Income", path: "/incomes", icon: ArrowUpIcon },
      { label: "Expenses", path: "/expenses", icon: ArrowDownIcon },
      { label: "Accounts", path: "/accounts", icon: CreditCardIcon },
    ],
  },
  {
    name: "Planning",
    items: [
      { label: "Budgets", path: "/budgets", icon: WalletIcon },
      { label: "Savings Goals", path: "/goals", icon: TargetIcon },
      { label: "Savings", path: "/savings", icon: PiggyIcon },
      { label: "Bills & Subscriptions", path: "/bills", icon: CalendarIcon },
    ],
  },
  {
    name: "Tools",
    items: [
      { label: "Recurring", path: "/recurring", icon: RepeatIcon },
      { label: "Automations", path: "/automations", icon: ZapIcon },
      { label: "Tags", path: "/tags", icon: TagIcon },
    ],
  },
  {
    name: "General",
    items: [
      { label: "Notifications", path: "/notifications", icon: BellIcon },
      { label: "Settings", path: "/settings", icon: CogIcon },
    ],
  },
];

export default defineComponent({
  name: "Sidebar",
  components: { ThemeToggle },
  props: {
    collapsed: { type: Boolean, default: false },
  },
  emits: ["toggle"],
  setup() {
    const route = useRoute();
    const authStore = useAuthStore();

    const groups = GROUPS;

    const isActive = (path: string) => route.path === path;

    const activeStyle = {
      backgroundColor: "var(--accent-50)",
      color: "var(--accent-color)",
    };
    const idleStyle = {
      color: "var(--text-secondary)",
    };

    const fullName = computed(() => authStore.fullName || "User");
    const username = computed(() => authStore.user?.username || "");
    const initials = computed(() => {
      const parts = fullName.value.trim().split(/\s+/).filter(Boolean);
      if (!parts.length) return "?";
      return (parts[0][0] + (parts[parts.length - 1][0] || "")).toUpperCase();
    });

    const logout = () => authStore.logout();

    return {
      groups,
      isActive,
      activeStyle,
      idleStyle,
      fullName,
      username,
      initials,
      logout,
      LogoutIcon,
      ChevronsLeftIcon,
      ChevronsRightIcon,
    };
  },
});
</script>
