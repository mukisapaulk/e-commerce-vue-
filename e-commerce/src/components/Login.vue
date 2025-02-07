<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
    </form>
    <p>OR</p>
    <div>
      <button @click="authStore.googleLogin">Login with Google</button>

      <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const email = ref<string>('')
const password = ref<string>('')
const authStore = useAuthStore()

const handleLogin = () => {
  authStore.login(email.value, password.value)
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
