<template>
  <div >
    <!-- Sidebar (Navbar.vue) -->
    <Navbar />
    <!-- Main Content -->
    <a-layout style="margin-left: 250px;">
      <a-layout-content class="dashboard-content">
        <div class="dashboard-header">
          <a-typography-title level="2" class="dashboard-title">
            Dashboard
          </a-typography-title>
          <a-typography-paragraph class="welcome-message">
            {{ greetings }}, {{ fullName }}!
          </a-typography-paragraph>
        </div>

        <!-- Account Summary -->
        <a-card class="account-summary" title="Account Summary" hoverable>
          <div class="summary-cards">
            <a-card class="summary-card" bordered hoverable>
              <a-icon type="dollar" class="summary-icon" />
              <a-typography-title level="4" class="card-title">
                Total Income
              </a-typography-title>
              <a-typography-text class="card-value">
                ₱{{ totalIncome }}
              </a-typography-text>
            </a-card>

            <a-card class="summary-card" bordered hoverable>
              <a-icon type="wallet" class="summary-icon" />
              <a-typography-title level="4" class="card-title">
                Total Expenses
              </a-typography-title>
              <a-typography-text class="card-value">
                ₱{{ totalExpenses }}
              </a-typography-text>
            </a-card>

            <a-card class="summary-card" bordered hoverable>
              <a-icon type="bank" class="summary-icon" />
              <a-typography-title level="4" class="card-title">
                Balance
              </a-typography-title>
              <a-typography-text class="card-value">
                ₱{{ balance }}
              </a-typography-text>
            </a-card>
          </div>
        </a-card>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import Navbar from "../components/Navbar.vue";
import { useAuthStore } from "../stores/authStore";
import { getFullName, getGreetings } from "../utils";
import { DollarOutlined, WalletOutlined, BankOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  components: { Navbar, DollarOutlined, WalletOutlined, BankOutlined },
  setup() {
    const authStore: any = useAuthStore();
    const totalIncome = ref(5000);
    const totalExpenses = ref(2000);
    const balance = ref(totalIncome.value - totalExpenses.value);
    const loading = ref(true);

    const fullName = computed(() => {
      return getFullName(authStore.user)
    });

    const greetings = computed(() => getGreetings());

    return {
      fullName,
      totalIncome,
      totalExpenses,
      balance,
      loading,
      greetings
    };
  },
});
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
}

.dashboard-content {
  padding: 24px;
  color: white;
}

.dashboard-header {
  margin-bottom: 20px;
}

.dashboard-title {
  color: #000000;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 5px;
}

.welcome-message {
  color: #000000;
  font-size: 16px;
}

.account-summary {
  background-color: #ffffff; /* Dark card background */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* Slightly larger shadow */
  margin-top: 20px;
}

.summary-cards {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  flex-wrap: wrap; /* Allow wrapping for smaller screens */
}

.summary-card {
  flex: 1;
  text-align: center;
  padding: 20px;
  background-color: #001f3f;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
  margin-bottom: 20px;
}

.summary-card:hover {
  border-color: #1890ff;
  transform: translateY(-5px);
}

.summary-icon {
  font-size: 36px;
  margin-bottom: 10px;
  color: #1890ff;
}

.card-title {
  color: #ffffff;
  font-size: 18px;
  margin-bottom: 5px;
}

.card-value {
  color: #40a9ff;
  font-size: 20px;
  font-weight: bold;
}

/* Media queries for smaller screens */
@media (max-width: 768px) {
  .dashboard-content {
    padding: 16px;
  }

  .summary-cards {
    flex-direction: column;
    align-items: center;
  }

  .summary-card {
    width: 100%;
    max-width: 300px;
  }
}
</style>
