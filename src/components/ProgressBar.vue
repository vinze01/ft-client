<template>
  <div
    class="progress-bar"
    role="progressbar"
    :aria-valuenow="Math.round(clamped)"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="label"
  >
    <div
      class="progress-fill"
      :style="{ width: `${clamped}%`, backgroundColor: fillColor }"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from "vue";

export default defineComponent({
  name: "ProgressBar",
  props: {
    /** Percentage 0–100 (values above 100 are clamped for display). */
    value: { type: Number, required: true },
    /** "auto" picks income/warning/expense by threshold. */
    tone: {
      type: String as PropType<"auto" | "income" | "expense" | "warning" | "accent">,
      default: "auto",
    },
    label: { type: String, default: "Progress" },
  },
  setup(props) {
    const clamped = computed(() => Math.max(0, Math.min(props.value, 100)));

    const fillColor = computed(() => {
      if (props.tone === "income") return "var(--income)";
      if (props.tone === "expense") return "var(--expense)";
      if (props.tone === "warning") return "var(--warning)";
      if (props.tone === "accent") return "var(--accent-color)";
      if (props.value > 90) return "var(--expense)";
      if (props.value > 70) return "var(--warning)";
      return "var(--income)";
    });

    return { clamped, fillColor };
  },
});
</script>
