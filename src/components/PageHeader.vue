<template>
  <div
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"
  >
    <div class="min-w-0">
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="subtitle" class="text-[13px] mt-0.5" style="color: var(--text-secondary)">
        {{ subtitle }}
      </p>
    </div>
    <div v-if="$slots.actions" class="flex items-center gap-2 flex-wrap flex-shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageHeader",
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
  },
});
</script>
