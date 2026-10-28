<template>
  <div class="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2 sm:gap-3">
    <!-- View type segmented control -->
    <div
      class="inline-flex rounded-lg p-0.5 self-start"
      style="background-color: var(--surface-elevated); border: 1px solid var(--border)"
      role="tablist"
      aria-label="Period type"
    >
      <button
        v-for="v in views"
        :key="v.value"
        type="button"
        role="tab"
        :aria-selected="view === v.value"
        class="px-3 py-1.5 rounded-md text-[13px] font-medium whitespace-nowrap transition-colors duration-150"
        :style="
          view === v.value
            ? { backgroundColor: 'var(--surface)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-card)' }
            : { color: 'var(--text-secondary)' }
        "
        @click="$emit('update:view', v.value)"
      >
        {{ v.label }}
      </button>
    </div>

    <!-- Period navigation -->
    <div class="flex items-center gap-1" style="color: var(--text-secondary)">
      <button
        type="button"
        class="p-1.5 rounded-md hover:bg-[var(--surface-elevated)]"
        aria-label="Previous period"
        @click="$emit('prev')"
      >
        <component :is="ChevronLeftIcon" class="w-4 h-4" />
      </button>
      <span
        class="text-sm font-semibold px-1 whitespace-nowrap"
        style="color: var(--text-primary)"
        >{{ periodLabel }}</span
      >
      <button
        type="button"
        class="p-1.5 rounded-md hover:bg-[var(--surface-elevated)]"
        aria-label="Next period"
        @click="$emit('next')"
      >
        <component :is="ChevronRightIcon" class="w-4 h-4" />
      </button>
    </div>

    <!-- Half-month selection (bi-monthly view only) -->
    <select
      v-if="view === 'bi-monthly'"
      class="input w-auto !py-1.5 text-[13px]"
      :value="halfMonth"
      aria-label="Half of month"
      @change="$emit('update:halfMonth', Number(($event.target as HTMLSelectElement).value))"
    >
      <option :value="1">1st Half (1–15)</option>
      <option :value="2">2nd Half (16–31)</option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

export type PeriodView = "bi-monthly" | "monthly" | "yearly";

const VIEWS: Array<{ value: PeriodView; label: string }> = [
  { value: "bi-monthly", label: "Bi-Monthly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export default defineComponent({
  name: "PeriodSelector",
  components: {},
  props: {
    view: { type: String as PropType<PeriodView>, required: true },
    periodLabel: { type: String, required: true },
    halfMonth: { type: Number, default: 1 },
  },
  emits: ["update:view", "update:halfMonth", "prev", "next"],
  setup() {
    const views = VIEWS;
    return { views, ChevronLeftIcon, ChevronRightIcon };
  },
});
</script>
