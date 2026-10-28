<template>
  <header
    class="sticky top-0 z-30 md:hidden h-14 flex items-center justify-between px-4"
    style="background-color: var(--surface); border-bottom: 1px solid var(--border)"
  >
    <router-link to="/dashboard" class="flex items-center gap-2 min-w-0">
      <img
        src="/assets/ft-logo.png"
        alt="FinanceTracker"
        class="w-7 h-7 rounded-md object-cover"
      />
      <span class="text-sm font-semibold" style="color: var(--text-primary)"
        >FinanceTracker</span
      >
    </router-link>
    <ThemeToggle />
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ThemeToggle from "./ThemeToggle.vue";

export default defineComponent({
  name: "MobileTopbar",
  components: { ThemeToggle },
});
</script>
