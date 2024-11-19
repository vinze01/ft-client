<template>
  <div class="register-page">
    <a-card class="register-form" title="Register">
      <a-form :model="formState" @submit.prevent="onSubmit" layout="vertical">
        <a-row type="flex" :gutter="[10, 10]">
          <a-col :span="8">
            <a-form-item
              label="First Name"
              :rules="[{ required: true, message: 'Please enter your first name' }]"
            >
              <a-input
                v-model:value="formState.firstName"
                placeholder="Enter your first name"
              />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item label="Middle Name">
              <a-input
                v-model:value="formState.middleName"
                placeholder="Enter your middle name (optional)"
              />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item
              label="Last Name"
              :rules="[{ required: true, message: 'Please enter your last name' }]"
            >
              <a-input
                v-model:value="formState.lastName"
                placeholder="Enter your last name"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
              label="Contact No"
              :rules="[{ required: true, message: 'Please enter your contact number' }]"
            >
              <a-input
                v-model:value="formState.contactNo"
                placeholder="Enter your contact number"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
              label="Email"
              :rules="[{ required: true, message: 'Please enter your email' }]"
            >
              <a-input v-model:value="formState.email" placeholder="Enter your email" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- Username -->
        <a-form-item
          label="Username"
          :rules="[{ required: true, message: 'Please enter your username' }]"
        >
          <a-input v-model:value="formState.username" placeholder="Enter your username" />
        </a-form-item>

        <!-- Password -->
        <a-form-item
          label="Password"
          :rules="[{ required: true, message: 'Please enter your password' }]"
        >
          <a-input-password
            v-model:value="formState.password"
            placeholder="Enter your password"
          />
        </a-form-item>

        <a-col :span="24">
          <a-form-item label="Upload Avatar">
            <a-upload-dragger
              v-model:file-list="fileList"
              :before-upload="handleUpload"
              :max-count="1"
            >
              <p class="ant-upload-text">Drag and drop an image or click to upload</p>
            </a-upload-dragger>
          </a-form-item>
        </a-col>

        <!-- Submit Button -->
        <a-form-item>
          <a-button type="primary" html-type="submit" block> Register </a-button>
        </a-form-item>
      </a-form>

      <p>Already have an account? <router-link to="/login">Login here</router-link></p>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

export default defineComponent({
  setup() {
    const formState = ref({
      firstName: "",
      middleName: "",
      lastName: "",
      contactNo: "",
      email: "",
      username: "",
      password: "",
    });

    const authStore = useAuthStore();
    const router = useRouter();
    const fileList = ref([]);
    const handleUpload = (file: any) => {
      fileList.value = [file];
      return false;
    };

    const onSubmit = async () => {
      try {
        const formData = new FormData();
        Object.keys(formState.value).forEach((key) => {
          formData.append(key, formState.value[key]);
        });
        if (fileList.value.length) {
          formData.append("avatar", fileList.value[0]);
        }

        await authStore.register(formData);
        await router.push("/login");
      } catch (error) {
        console.error("Registration failed", error);
      }
    };

    return {
      formState,
      onSubmit,
      fileList,
      handleUpload,
    };
  },
});
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.register-form {
  max-width: 600px;
  width: 100%;
}

a-button {
  width: 100%;
}
</style>
