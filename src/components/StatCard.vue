<template>
  <div class="stat-card">
    <div class="flex items-center justify-between mb-3">
      <span class="card-title">{{ label }}</span>
      <span
        v-if="icon"
        class="stat-icon"
        :style="{ backgroundColor: toneStyle.bg, color: toneStyle.fg }"
        aria-hidden="true"
      >
        <component :is="icon" class="w-[18px] h-[18px]" />
      </span>
    </div>
    <p
      class="text-2xl font-semibold financial-amount leading-8"
      :style="valueStyle"
    >
      {{ value }}
    </p>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType, type CSSProperties } from "vue";

export type StatTone = "default" | "income" | "expense" | "warning" | "accent";

export default defineComponent({
  name: "StatCard",
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    icon: { type: [Object, Function] as PropType<object | null>, default: null },
    tone: { type: String as PropType<StatTone>, default: "default" },
    /** Override value color, e.g. conditional income/expense coloring. */
    valueColor: { type: String, default: "" },
  },
  setup(props) {
    const toneStyles: Record<StatTone, { bg: string; fg: string }> = {
      default: { bg: "var(--surface-elevated)", fg: "var(--text-secondary)" },
      income: { bg: "var(--income-soft)", fg: "var(--income)" },
      expense: { bg: "var(--expense-soft)", fg: "var(--expense)" },
      warning: { bg: "var(--warning-soft)", fg: "var(--warning)" },
      accent: { bg: "var(--accent-100)", fg: "var(--accent-color)" },
    };

    const toneStyle = computed(() => toneStyles[props.tone] || toneStyles.default);
    const valueStyle = computed<CSSProperties>(() =>
      props.valueColor ? { color: props.valueColor } : { color: "var(--text-primary)" },
    );

    return { toneStyle, valueStyle };
  },
});
</script>
