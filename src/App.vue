<template>
  <div class="min-h-screen bg-pattern pb-20 md:pb-6">
    <Navbar v-if="authStore.isAuthenticated" />
    <main
      v-if="authStore.isAuthenticated"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6"
    >
      <router-view />
    </main>
    <router-view v-if="!authStore.isAuthenticated" />
    <BottomNav v-if="authStore.isAuthenticated" />
    <Toast ref="toastRef" />
    <ConfirmModal ref="confirmRef" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useAuthStore } from "./stores/authStore";
import Navbar from "./components/Navbar.vue";
import BottomNav from "./components/BottomNav.vue";
import Toast from "./components/Toast.vue";
import ConfirmModal from "./components/ConfirmModal.vue";

export default defineComponent({
  name: "App",
  components: { Navbar, BottomNav, Toast, ConfirmModal },
  setup() {
    const authStore = useAuthStore();
    const toastRef = ref<InstanceType<typeof Toast> | null>(null);
    const confirmRef = ref<InstanceType<typeof ConfirmModal> | null>(null);

    onMounted(() => {
      (window as any).__toastRef = toastRef.value;
      (window as any).__confirmRef = confirmRef.value;
    });

    return { authStore, toastRef, confirmRef };
  },
});
</script>
