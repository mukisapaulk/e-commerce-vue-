<template>
  <div>
    <h2>Add new user</h2>
    <form @submit.prevent="handleSignUp">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />

      <!-- Role Selection -->
      <label>Role:</label>
      <select v-model="role">
        <option value="customer">Customer</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit" :disabled="authStore.loading">Sign Up</button>
      <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const username = ref<string>('') // New field
const email = ref<string>('')
const password = ref<string>('')
const role = ref<string>('customer') // Default to customer
const authStore = useAuthStore()

const handleSignUp = () => {
  authStore.signUp(email.value, password.value, username.value, role.value)
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
