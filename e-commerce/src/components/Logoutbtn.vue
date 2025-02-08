<template>
  <button
    @click="authStore.logout()"
    class=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
  >
    <RouterLink to="/" class="block w-full h-full">
      Logout
    </RouterLink>
  </button>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
</script>
