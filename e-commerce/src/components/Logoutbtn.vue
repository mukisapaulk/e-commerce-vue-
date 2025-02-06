<template>
    <button @click="authStore.logout()">Logout</button>
  </template>
  
  <script setup lang="ts">
  import { useAuthStore } from "@/stores/authStore";
  
  const authStore = useAuthStore();
  </script>
  