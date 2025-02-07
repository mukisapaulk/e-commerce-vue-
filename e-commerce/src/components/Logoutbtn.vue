<template>
  <button @click="authStore.logout()">
    <RouterLink to="/">logout</RouterLink>
  </button>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
</script>
