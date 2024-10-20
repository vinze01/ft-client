<template>
  <a-layout-header style="background-color: #001529;">
    <div class="navbar">
      <a-menu
        mode="horizontal"
        theme="dark"
        :default-selected-keys="['dashboard']"
        style="line-height: 64px; text-align: center;"
      >
        <a-menu-item key="dashboard">
          <router-link to="/dashboard">Dashboard</router-link>
        </a-menu-item>
        <a-menu-item key="budgets">
          <router-link to="/budgets">Budgets</router-link>
        </a-menu-item>
        <a-menu-item key="expenses">
          <router-link to="/expenses">Expenses</router-link>
        </a-menu-item>
        <a-menu-item v-if="isAuthenticated" @click="logout" class="logout">
          Logout
        </a-menu-item>
      </a-menu>
    </div>
  </a-layout-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../stores/authStore';

export default defineComponent({
  setup() {
    const authStore = useAuthStore();
    const logout = () => authStore.logout();

    return { isAuthenticated: authStore.isAuthenticated, logout };
  },
});
</script>

<style scoped>
.navbar {
  max-width: 1200px; /* Center the navbar with max-width */
  margin: 0 auto; /* Center horizontally */
}

.a-menu {
  display: flex; /* Use flexbox for layout */
  justify-content: center; /* Center the menu items */
  padding: 0 20px; /* Horizontal padding */
}

.logout {
  cursor: pointer; /* Pointer cursor for logout */
  color: #e74c3c; /* Red color for logout to highlight */
  font-weight: bold; /* Bold text for emphasis */
}

.logout:hover {
  text-decoration: underline; /* Underline on hover for logout */
}

a {
  color: white; /* White text for links */
}

a:hover {
  color: #1890ff; /* Light blue on hover */
}
</style>
