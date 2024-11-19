<template>
  <div class="login-page">
    <a-card class="login-form" title="Login">
      <a-form @submit.prevent="login" layout="vertical">
        <!-- Username -->
        <a-form-item
          label="Username"
          :rules="[{ required: true, message: 'Please enter your username' }]"
        >
          <a-input 
            v-model:value="username" 
            placeholder="Enter your username" 
          />
        </a-form-item>

        <!-- Password -->
        <a-form-item
          label="Password"
          :rules="[{ required: true, message: 'Please enter your password' }]"
        >
          <a-input-password 
            v-model:value="password" 
            placeholder="Enter your password" 
          />
        </a-form-item>

        <!-- Submit Button -->
        <a-form-item>
          <a-button type="primary" html-type="submit" block> Login </a-button>
        </a-form-item>
      </a-form>

      <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { notification } from 'ant-design-vue';
import { getFullName } from '../utils';

export default defineComponent({
  setup() {
    const authStore = useAuthStore();
    const username = ref<string>('');
    const password = ref<string>('');

    const login = async () => {
      if (!username.value || !password.value) {
        notification.error({
          message: 'Invalid Action',
          description: 'Please enter both username and password.',
        });
        return;
      }

      try {
        await authStore.login(username.value, password.value);

        notification.success({
          message: 'Login Successful',
          description: `Welcome back, ${getFullName(authStore.user)}!`,
        });
      } catch (error) {
        notification.error({
          message: 'Login Failed',
          description: error.response?.data?.error || 'An unexpected error occurred.',
        });
      }
    };

    return { username, password, login };
  },
});
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-form {
  max-width: 400px;
  width: 100%;
}

a-button {
  width: 100%;
}
</style>
