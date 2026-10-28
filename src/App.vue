<template>
  <div class="min-h-screen bg-canvas">
    <template v-if="authStore.isAuthenticated">
      <Sidebar :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />
      <MobileTopbar />
      <main
        class="pt-4 pb-24 md:pt-6 md:pb-10"
        :class="sidebarCollapsed ? 'md:pl-[68px]' : 'md:pl-60'"
        :style="{ transition: 'padding 220ms ease' }"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
      <BottomNav />
    </template>
    <main v-else>
      <router-view />
    </main>
    <Toast ref="toastRef" />
    <ConfirmModal ref="confirmRef" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useAuthStore } from "./stores/authStore";
import Sidebar from "./components/Sidebar.vue";
import MobileTopbar from "./components/MobileTopbar.vue";
import BottomNav from "./components/BottomNav.vue";
import Toast from "./components/Toast.vue";
import ConfirmModal from "./components/ConfirmModal.vue";

export default defineComponent({
  name: "App",
  components: { Sidebar, MobileTopbar, BottomNav, Toast, ConfirmModal },
  setup() {
    const authStore = useAuthStore();
    const toastRef = ref<InstanceType<typeof Toast> | null>(null);
    const confirmRef = ref<InstanceType<typeof ConfirmModal> | null>(null);

    const sidebarCollapsed = ref(
      localStorage.getItem("sidebarCollapsed") === "true",
    );

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
      localStorage.setItem(
        "sidebarCollapsed",
        String(sidebarCollapsed.value),
      );
    };

    onMounted(() => {
      (window as any).__toastRef = toastRef.value;
      (window as any).__confirmRef = confirmRef.value;
    });

    return {
      authStore,
      sidebarCollapsed,
      toggleSidebar,
      toastRef,
      confirmRef,
    };
  },
});
</script>

<style>
/* Page transition (respects reduced motion via the global rule) */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.page-leave-to {
  opacity: 0;
}

/* Mobile "More" drawer */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 200ms ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 200ms ease;
}

.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateY(100%);
}
</style>
