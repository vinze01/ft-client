<template>
  <div class="min-h-screen bg-pattern">
    <Navbar v-if="isAuthenticated" />
    <main v-if="isAuthenticated" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <router-view v-else />
    <Toast ref="toastRef" />
    <ConfirmModal ref="confirmRef" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';
import Navbar from './components/Navbar.vue';
import Toast from './components/Toast.vue';
import ConfirmModal from './components/ConfirmModal.vue';

export default defineComponent({
  name: 'App',
  components: { Navbar, Toast, ConfirmModal },
  setup() {
    const authStore = useAuthStore();
    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const toastRef = ref<InstanceType<typeof Toast> | null>(null);
    const confirmRef = ref<InstanceType<typeof ConfirmModal> | null>(null);

    onMounted(() => {
      (window as any).__toastRef = toastRef.value;
      (window as any).__confirmRef = confirmRef.value;
    });

    return { isAuthenticated, toastRef, confirmRef };
  }
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>