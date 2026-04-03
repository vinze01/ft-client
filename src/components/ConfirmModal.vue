<template>
  <Teleport to="body">
    <transition name="confirm">
      <div v-if="visible" class="modal-overlay" @click.self="handleCancel">
        <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-sm w-full border border-white/20 animate-scale-in">
          <div class="p-6 text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              :class="[
                type === 'danger' ? 'bg-red-100' :
                type === 'warning' ? 'bg-amber-100' :
                'bg-blue-100'
              ]"
            >
              <svg v-if="type === 'danger'" class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <svg v-else-if="type === 'warning'" class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <svg v-else class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">{{ title }}</h3>
            <p class="text-gray-500 text-sm">{{ content }}</p>
          </div>
          <div class="flex border-t border-gray-100">
            <button
              @click="handleCancel"
              class="flex-1 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors rounded-bl-3xl"
            >
              {{ cancelText }}
            </button>
            <div class="w-px bg-gray-100"></div>
            <button
              @click="handleConfirm"
              class="flex-1 py-4 text-sm font-medium transition-colors rounded-br-3xl"
              :class="[
                type === 'danger' ? 'text-red-600 hover:bg-red-50' :
                type === 'warning' ? 'text-amber-600 hover:bg-amber-50' :
                'text-blue-600 hover:bg-blue-50'
              ]"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ConfirmModal',
  setup() {
    const visible = ref(false);
    const title = ref('Confirm');
    const content = ref('');
    const type = ref<'danger' | 'warning' | 'info'>('info');
    const confirmText = ref('Confirm');
    const cancelText = ref('Cancel');
    let resolveRef: ((value: boolean) => void) | null = null;

    const show = (opts: {
      title: string;
      content: string;
      type?: 'danger' | 'warning' | 'info';
      confirmText?: string;
      cancelText?: string;
    }) => {
      title.value = opts.title;
      content.value = opts.content;
      type.value = opts.type || 'info';
      confirmText.value = opts.confirmText || 'Confirm';
      cancelText.value = opts.cancelText || 'Cancel';
      visible.value = true;

      return new Promise<boolean>((resolve) => {
        resolveRef = resolve;
      });
    };

    const handleConfirm = () => {
      visible.value = false;
      resolveRef?.(true);
    };

    const handleCancel = () => {
      visible.value = false;
      resolveRef?.(false);
    };

    return {
      visible,
      title,
      content,
      type,
      confirmText,
      cancelText,
      show,
      handleConfirm,
      handleCancel
    };
  }
});

export const confirm = (opts: {
  title: string;
  content: string;
  type?: 'danger' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
}) => (window as any).__confirmRef?.show(opts);
</script>

<style scoped>
.confirm-enter-active {
  animation: fadeIn 0.2s ease-out;
}
.confirm-leave-active {
  animation: fadeOut 0.15s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>