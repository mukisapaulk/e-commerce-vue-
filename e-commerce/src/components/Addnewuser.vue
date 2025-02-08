<template>
  <div class="container mx-auto p-6 bg-white shadow-md rounded-lg border dark:bg-gray-900">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Add New User</h2>
    <form @submit.prevent="handleSignUp" class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
      <!-- Username -->
      <div class="flex flex-col md:flex-row items-center">
        <label for="username" class="md:w-1/3 text-gray-700 dark:text-gray-300">Username:</label>
        <input
          v-model="username"
          id="username"
          type="text"
          placeholder="Enter username"
          required
          class="flex-1 p-3 rounded-lg border shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        />
      </div>

      <!-- Email -->
      <div class="flex flex-col md:flex-row items-center">
        <label for="email" class="md:w-1/3 text-gray-700 dark:text-gray-300">Email:</label>
        <input
          v-model="email"
          id="email"
          type="email"
          placeholder="Enter email"
          required
          class="flex-1 p-3 rounded-lg border shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        />
      </div>

      <!-- Password -->
      <div class="flex flex-col md:flex-row items-center">
        <label for="password" class="md:w-1/3 text-gray-700 dark:text-gray-300">Password:</label>
        <input
          v-model="password"
          id="password"
          type="password"
          placeholder="Enter password"
          required
          class="flex-1 p-3 rounded-lg border shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        />
      </div>

      <!-- Role -->
      <div class="flex flex-col md:flex-row items-center">
        <label for="role" class="md:w-1/3 text-gray-700 dark:text-gray-300">Role:</label>
        <select
          v-model="role"
          id="role"
          class="flex-1 p-3 rounded-lg border shadow-sm focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <!-- Submit Button -->
      <div class="flex flex-col md:flex-row items-center md:col-span-2 justify-end">
        <button
          type="submit"
          :disabled="authStore.loading"
          class="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:ring focus:ring-blue-300 disabled:opacity-50"
        >
          Sign Up
        </button>
      </div>

      <!-- Error Message -->
      <p v-if="authStore.error" class="text-red-500 text-sm md:col-span-2">{{ authStore.error }}</p>
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
