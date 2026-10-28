<template>
  <div class="min-h-screen flex bg-canvas">
    <!-- Theme toggle (themeStore-driven) -->
    <button
      type="button"
      class="fixed top-4 right-4 p-2 rounded-lg z-50 hover:bg-[var(--surface-elevated)]"
      :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      :aria-label="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      style="color: var(--text-secondary)"
      @click="themeStore.toggle()"
    >
      <component :is="themeStore.isDark ? SunIcon : MoonIcon" class="w-5 h-5" />
    </button>

    <!-- Left brand panel (desktop only) -->
    <div
      class="hidden lg:flex lg:w-[45%] xl:w-1/2 flex-col justify-between p-10 xl:p-16"
      style="background-color: var(--surface); border-right: 1px solid var(--border)"
    >
      <div class="flex items-center gap-2.5">
        <img
          src="/assets/ft-logo.png"
          alt="FinanceTracker logo"
          class="w-9 h-9 rounded-lg object-cover"
        />
        <span class="text-lg font-semibold" style="color: var(--text-primary)"
          >FinanceTracker</span
        >
      </div>

      <div class="max-w-md">
        <h1
          class="text-[32px] leading-10 font-semibold tracking-tight"
          style="color: var(--text-primary)"
        >
          {{ headline }}
        </h1>
        <p class="mt-3 text-[15px] leading-6" style="color: var(--text-secondary)">
          {{ description }}
        </p>

        <ul class="mt-8 space-y-3">
          <li
            v-for="feature in features"
            :key="feature"
            class="flex items-center gap-3 text-sm"
            style="color: var(--text-secondary)"
          >
            <span
              class="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
              :style="{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-color)' }"
              aria-hidden="true"
            >
              <component :is="CheckIcon" class="w-3.5 h-3.5" />
            </span>
            {{ feature }}
          </li>
        </ul>
      </div>

      <p class="text-xs" style="color: var(--text-muted)">
        Personal finance, kept simple.
      </p>
    </div>

    <!-- Right form panel -->
    <div class="flex-1 flex items-center justify-center p-6 sm:p-10">
      <div class="w-full max-w-md animate-fade-in">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useThemeStore } from "../stores/themeStore";
import { CheckIcon, SunIcon, MoonIcon } from "./icons";

export default defineComponent({
  name: "AuthLayout",
  props: {
    headline: { type: String, required: true },
    description: { type: String, required: true },
    features: {
      type: Array as () => string[],
      default: () => [
        "Track daily income and expenses",
        "Set budgets and savings goals",
        "Manage bills and recurring transactions",
      ],
    },
  },
  setup() {
    const themeStore = useThemeStore();
    return { themeStore, CheckIcon, SunIcon, MoonIcon };
  },
});
</script>
