<template>
  <nav
    class="fixed bottom-0 inset-x-0 z-40 md:hidden"
    style="background-color: var(--surface); border-top: 1px solid var(--border)"
    aria-label="Mobile navigation"
  >
    <div class="flex items-stretch justify-around h-16 px-2">
      <router-link
        v-for="item in mainItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center gap-0.5 w-16 rounded-lg"
        :style="
          isActive(item.path)
            ? { color: 'var(--accent-color)' }
            : { color: 'var(--text-secondary)' }
        "
        :aria-current="isActive(item.path) ? 'page' : undefined"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="text-[11px] font-medium">{{ item.label }}</span>
      </router-link>

      <!-- Quick add -->
      <router-link
        to="/expenses"
        class="flex flex-col items-center justify-end gap-0.5 w-16 pb-1.5"
        style="color: var(--text-secondary)"
        aria-label="Add transaction"
      >
        <span
          class="w-10 h-10 -mt-4 rounded-xl flex items-center justify-center text-white shadow-card"
          :style="{ backgroundColor: 'var(--accent-color)' }"
          aria-hidden="true"
        >
          <component :is="PlusIcon" class="w-5 h-5" />
        </span>
        <span class="text-[11px] font-medium">Add</span>
      </router-link>

      <!-- More -->
      <button
        type="button"
        class="flex flex-col items-center justify-center gap-0.5 w-16 rounded-lg"
        style="color: var(--text-secondary)"
        aria-haspopup="dialog"
        :aria-expanded="drawerOpen"
        @click="drawerOpen = true"
      >
        <component :is="MoreIcon" class="w-5 h-5" />
        <span class="text-[11px] font-medium">More</span>
      </button>
    </div>
  </nav>

  <!-- More drawer -->
  <Transition name="drawer">
    <div
      v-if="drawerOpen"
      class="fixed inset-0 z-50 md:hidden"
      @keydown.esc="drawerOpen = false"
    >
      <div
        class="absolute inset-0 bg-black/50"
        aria-hidden="true"
        @click="drawerOpen = false"
      ></div>
      <div
        class="drawer-panel absolute bottom-0 inset-x-0 rounded-t-2xl max-h-[80vh] overflow-y-auto p-5 pb-8"
        style="background-color: var(--surface)"
        role="dialog"
        aria-modal="true"
        aria-label="More navigation"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="section-title">More</h2>
          <button
            type="button"
            class="p-2 rounded-lg hover:bg-[var(--surface-elevated)]"
            aria-label="Close menu"
            style="color: var(--text-secondary)"
            @click="drawerOpen = false"
          >
            <component :is="XIcon" class="w-5 h-5" />
          </button>
        </div>

        <div v-for="group in drawerGroups" :key="group.name" class="mb-4">
          <p
            class="text-[11px] font-semibold uppercase tracking-wider mb-1.5"
            style="color: var(--text-muted)"
          >
            {{ group.name }}
          </p>
          <ul class="grid grid-cols-2 gap-1">
            <li v-for="item in group.items" :key="item.path">
              <router-link
                :to="item.path"
                class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium min-h-[44px]"
                :style="
                  isActive(item.path)
                    ? { backgroundColor: 'var(--accent-50)', color: 'var(--accent-color)' }
                    : { color: 'var(--text-secondary)' }
                "
                @click="drawerOpen = false"
              >
                <component :is="item.icon" class="w-[18px] h-[18px] flex-shrink-0" />
                <span class="truncate">{{ item.label }}</span>
              </router-link>
            </li>
          </ul>
        </div>

        <div
          class="flex items-center justify-between pt-3 mt-2"
          style="border-top: 1px solid var(--border)"
        >
          <div class="flex items-center gap-2.5 min-w-0">
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
            <p
              class="text-[13px] font-medium truncate"
              style="color: var(--text-primary)"
            >
              {{ fullName }}
            </p>
          </div>
          <div class="flex items-center gap-1">
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
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import ThemeToggle from "./ThemeToggle.vue";
import {
  HomeIcon,
  ArrowUpIcon,
  WalletIcon,
  PlusIcon,
  MoreIcon,
  XIcon,
  SparklesIcon,
  ArrowDownIcon,
  CreditCardIcon,
  TargetIcon,
  PiggyIcon,
  CalendarIcon,
  RepeatIcon,
  ZapIcon,
  TagIcon,
  BellIcon,
  CogIcon,
  LogoutIcon,
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

// Everything except the four bottom-bar destinations.
const DRAWER_GROUPS: NavGroup[] = [
  {
    name: "Overview",
    items: [{ label: "Insights", path: "/insights", icon: SparklesIcon }],
  },
  {
    name: "Money",
    items: [
      { label: "Expenses", path: "/expenses", icon: ArrowDownIcon },
      { label: "Accounts", path: "/accounts", icon: CreditCardIcon },
    ],
  },
  {
    name: "Planning",
    items: [
      { label: "Savings Goals", path: "/goals", icon: TargetIcon },
      { label: "Savings", path: "/savings", icon: PiggyIcon },
      { label: "Bills", path: "/bills", icon: CalendarIcon },
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
  name: "BottomNav",
  components: { ThemeToggle },
  setup() {
    const route = useRoute();
    const authStore = useAuthStore();
    const drawerOpen = ref(false);

    const mainItems: NavItem[] = [
      { label: "Home", path: "/dashboard", icon: HomeIcon },
      { label: "Income", path: "/incomes", icon: ArrowUpIcon },
      { label: "Budgets", path: "/budgets", icon: WalletIcon },
    ];

    const isActive = (path: string) => route.path === path;

    const fullName = computed(() => authStore.fullName || "User");
    const initials = computed(() => {
      const parts = fullName.value.trim().split(/\s+/).filter(Boolean);
      if (!parts.length) return "?";
      return (parts[0][0] + (parts[parts.length - 1][0] || "")).toUpperCase();
    });

    const logout = () => authStore.logout();

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") drawerOpen.value = false;
    };
    onMounted(() => document.addEventListener("keydown", onKeydown));
    onUnmounted(() => document.removeEventListener("keydown", onKeydown));

    return {
      mainItems,
      drawerGroups: DRAWER_GROUPS,
      drawerOpen,
      isActive,
      fullName,
      initials,
      logout,
      PlusIcon,
      MoreIcon,
      XIcon,
      LogoutIcon,
    };
  },
});
</script>
