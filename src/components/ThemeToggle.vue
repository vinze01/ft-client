<template>
  <button
    type="button"
    class="p-2 rounded-lg hover:bg-[var(--surface-elevated)]"
    :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :aria-label="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    style="color: var(--text-secondary)"
    @click="themeStore.toggle()"
  >
    <component :is="themeStore.isDark ? SunIcon : MoonIcon" class="w-[18px] h-[18px]" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useThemeStore } from "../stores/themeStore";
import { SunIcon, MoonIcon } from "./icons";

export default defineComponent({
  name: "ThemeToggle",
  setup() {
    const themeStore = useThemeStore();
    return { themeStore, SunIcon, MoonIcon };
  },
});
</script>
