<template>
  <div class="dashboard">
    <Navbar />
    <div class="dashboard-container">
      <SideCard />
      <div class="dashboard-content">
        <a-typography-title level="2">Dashboard</a-typography-title>
        <a-typography-paragraph>Welcome, {{ fullName }}!</a-typography-paragraph>

        <a-card class="account-summary" title="Account Summary">
          <div class="summary-cards">
            <a-card class="summary-card" bordered>
              <a-typography-title level="4">Total Income</a-typography-title>
              <a-typography-text>₱{{ totalIncome }}</a-typography-text>
            </a-card>
            <a-card class="summary-card" bordered>
              <a-typography-title level="4">Total Expenses</a-typography-title>
              <a-typography-text>₱{{ totalExpenses }}</a-typography-text>
            </a-card>
            <a-card class="summary-card" bordered>
              <a-typography-title level="4">Balance</a-typography-title>
              <a-typography-text>₱{{ balance }}</a-typography-text>
            </a-card>
          </div>
        </a-card>

        <!-- Other cards and content go here -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import Navbar from "../components/Navbar.vue";
import SideCard from "../components/SideCard.vue";
import { useAuthStore } from "../stores/authStore";
import { getFullName } from "../utils";

export default defineComponent({
  components: { Navbar, SideCard },
  setup() {
    const authStore: any = useAuthStore();
    console.log('authStore :>> ', authStore);
    const username = ref("User");
    const totalIncome = ref(5000);
    const totalExpenses = ref(2000);
    const balance = ref(totalIncome.value - totalExpenses.value);

    const fullName = computed(() => {
      return authStore.user ? getFullName(JSON.parse(authStore.user)) : 'Guest'; // Handle case where user is null
    });

    return {
      authStore,
      fullName,
      username,
      totalIncome,
      totalExpenses,
      balance,
    };
  },
});
</script>

<style scoped>
.dashboard-container {
  display: flex;
}

.dashboard-content {
  flex-grow: 1;
}

.summary-cards {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.summary-card {
  flex: 1;
  margin-right: 10px;
}

.summary-card:last-child {
  margin-right: 0;
}
</style>
