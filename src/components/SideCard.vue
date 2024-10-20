<template>
  <a-card class="side-card" :bordered="false">
    <div class="avatar-container">
      <a-avatar size="large" src="https://via.placeholder.com/150" />
      <p>{{ username }}</p>
    </div>

    <div class="contact-info">
      <a href="mailto:{{ email }}" class="contact-link">{{ email }}</a>
    </div>

    <div class="navigation-links">
      <a-button type="link" @click="$router.push('/dashboard')">Dashboard</a-button>
      <a-button type="link" @click="$router.push('/budgets')">Budgets</a-button>
      <a-button type="link" @click="$router.push('/expenses')">Expenses</a-button>
    </div>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "SideCard",
  setup() {
    const username = ref("User Name ko");
    const email = ref("user@example.com");

    return {
      username,
      email,
    };
  },
});
</script>

<style scoped>
.side-card {
  width: 250px;
  margin-right: 20px;
}

.avatar-container {
  text-align: center;
}

.avatar-container p {
  margin-top: 10px;
  font-size: 16px;
}

.contact-info {
  margin: 20px 0;
  text-align: center;
}

.contact-link {
  color: #1890ff;
  font-weight: bold;
}

.navigation-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.navigation-links a-button {
  text-align: left;
}
</style>
