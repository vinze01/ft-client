<template>
  <div class="empty-state">
    <component
      v-if="icon"
      :is="icon"
      class="empty-state-icon"
      aria-hidden="true"
    />
    <p class="empty-state-title">{{ title }}</p>
    <p v-if="description" class="empty-state-description">
      {{ description }}
    </p>
    <button
      v-if="actionLabel"
      type="button"
      class="btn btn-primary btn-sm mt-4"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  name: "EmptyState",
  props: {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    icon: { type: [Object, Function] as PropType<object | null>, default: null },
    actionLabel: { type: String, default: "" },
  },
  emits: ["action"],
});
</script>
