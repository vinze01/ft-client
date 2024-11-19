<template>
  <a-layout>
    <!-- Sidebar -->
    <a-layout-sider
      :breakpoint="'lg'"
      collapsible
      :collapsed="collapsed"
      :collapsed-width="80"
      theme="dark"
      width="250"
      style="height: 100vh; position: fixed; left: 0; top: 0;"
      @collapse="toggleCollapsed"
    >
      <!-- User Information Card - Show only when not collapsed -->
      <a-card v-if="!collapsed" class="side-card" :bordered="false">
        <div class="avatar-container">
          <a-avatar size="large">{{ initials }}</a-avatar>
          <p class="username">{{ fullName }}</p>
        </div>
        <div class="contact-info">
          <a href="mailto:{{ email }}" class="contact-link">{{ email }}</a>
        </div>
      </a-card>

      <!-- Navigation Menu with Icons -->
      <a-menu
        mode="inline"
        theme="dark"
        :inline-collapsed="collapsed"
        :default-selected-keys="['dashboard']"
      >
        <a-menu-item key="dashboard">
          <router-link to="/dashboard">
            <a-icon type="dashboard" />
            <span v-if="!collapsed">Dashboard</span>
          </router-link>
        </a-menu-item>

        <a-menu-item key="budgets">
          <router-link to="/budgets">
            <AreaChartOutlined />
            <span v-if="!collapsed">Budgets</span>
          </router-link>
        </a-menu-item>

        <a-menu-item key="expenses">
          <router-link to="/expenses">
            <a-icon type="wallet" />
            <span v-if="!collapsed">Expenses</span>
          </router-link>
        </a-menu-item>

        <a-menu-item v-if="isAuthenticated" @click="logout" class="logout">
          <a-icon type="logout" />
          <span v-if="!collapsed">Logout</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- Main Content -->
    <a-layout style="margin-left: 250px;">
      <a-layout-content style="padding: 24px;">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { AreaChartOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '../stores/authStore';
import { getFullName, getInitials } from "../utils";

export default defineComponent({
  setup() {
    const authStore = useAuthStore();
    const collapsed = ref(false);
    
    const toggleCollapsed = () => {
      collapsed.value = !collapsed.value;
    };

    const logout = () => authStore.logout();
    const fullName = computed(() => {
      return authStore.user ? getFullName(authStore.user) : "Guest";
    });

    const email = computed(() => {
      return authStore?.user && authStore?.user?.email || 'N/A';
    });

    const initials = computed(() => {
      return getInitials(authStore.user)
    })



    return {
      collapsed,
      toggleCollapsed,
      isAuthenticated: authStore.isAuthenticated,
      logout,
      fullName,
      email,
      initials
    };
  },
});
</script>

<style scoped>
/* Sidebar container */
.side-card {
  width: 100%;
  padding: 20px;
  background-color: #001529; /* Matches dark theme */
  margin-bottom: 20px;
}

/* Avatar and username styling */
.avatar-container {
  text-align: center;
}

.avatar-container p {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  color: white;
}

/* Styling for the contact info */
.contact-info {
  margin: 20px 0;
  text-align: center;
}

.contact-link {
  color: #1890ff;
  font-weight: bold;
  text-decoration: none;
}

/* Hover effect for contact link */
.contact-link:hover {
  text-decoration: underline;
}

/* Logout button styling */
.logout {
  cursor: pointer;
  color: #e74c3c;
  font-weight: bold;
}

.logout:hover {
  color: #ff6f61;
}

/* General anchor tag styling */
a {
  color: white;
}

a:hover {
  color: #1890ff;
}

/* Username text for improved readability */
.username {
  margin-top: 10px;
  color: white;
  font-size: 18px;
  font-weight: 600;
}
</style>
