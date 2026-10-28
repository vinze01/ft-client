<template>
  <Teleport to="body">
    <transition-group
      name="toast"
      tag="div"
      class="fixed top-4 right-4 z-[100] space-y-2"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border min-w-[280px]"
        :style="styleFor(toast.type)"
      >
        <div class="flex-shrink-0">
          <svg
            v-if="toast.type === 'success'"
            class="w-5 h-5"
            :style="{ color: 'var(--income)' }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <svg
            v-else-if="toast.type === 'error'"
            class="w-5 h-5"
            :style="{ color: 'var(--expense)' }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          <svg
            v-else-if="toast.type === 'warning'"
            class="w-5 h-5"
            :style="{ color: 'var(--warning)' }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          <svg
            v-else
            class="w-5 h-5"
            :style="{ color: 'var(--accent-color)' }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <p class="text-sm font-medium">{{ toast.message }}</p>
        <button
          @click="removeToast(toast.id)"
          class="ml-auto flex-shrink-0 opacity-60 hover:opacity-100"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </transition-group>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

let toastId = 0;

export default defineComponent({
  name: "ToastContainer",
  setup() {
    const toasts = ref<Toast[]>([]);

    const toastColors: Record<
      Toast["type"],
      { bg: string; border: string; text: string }
    > = {
      success: {
        bg: "var(--income-soft)",
        border: "var(--income)",
        text: "var(--text-primary)",
      },
      error: {
        bg: "var(--expense-soft)",
        border: "var(--expense)",
        text: "var(--text-primary)",
      },
      warning: {
        bg: "var(--warning-soft)",
        border: "var(--warning)",
        text: "var(--text-primary)",
      },
      info: {
        bg: "var(--accent-50)",
        border: "var(--accent-color)",
        text: "var(--text-primary)",
      },
    };
    const styleFor = (type: Toast["type"]) => {
      const c = toastColors[type];
      return {
        backgroundColor: c.bg,
        borderColor: c.border,
        color: c.text,
      };
    };

    const addToast = (
      message: string,
      type: Toast["type"] = "info",
      duration = 3000,
    ) => {
      const id = ++toastId;
      toasts.value.push({ id, message, type });

      setTimeout(() => {
        removeToast(id);
      }, duration);
    };

    const removeToast = (id: number) => {
      const idx = toasts.value.findIndex((t) => t.id === id);
      if (idx > -1) toasts.value.splice(idx, 1);
    };

    return { toasts, addToast, removeToast, styleFor };
  },
});

export const toast = {
  success: (msg: string) =>
    (window as any).__toastRef?.addToast(msg, "success"),
  error: (msg: string) => (window as any).__toastRef?.addToast(msg, "error"),
  warning: (msg: string) =>
    (window as any).__toastRef?.addToast(msg, "warning"),
  info: (msg: string) => (window as any).__toastRef?.addToast(msg, "info"),
};
</script>

<style scoped>
.toast-enter-active {
  animation: slideIn 0.3s ease-out;
}
.toast-leave-active {
  animation: slideOut 0.2s ease-in;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}
</style>
