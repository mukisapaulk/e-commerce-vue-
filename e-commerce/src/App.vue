<template>
  <div>
    <h1>Vue + Firebase Auth</h1>
    <div v-if="authStore.user">
      <p>Welcome, {{ authStore.user.displayName || authStore.user.email }}</p>
      <p>Role: <strong>{{ authStore.role }}</strong></p>
      <RouterLink to="/">Home</RouterLink>
      
      <!-- Admin-only Link -->
      <RouterLink v-if="authStore.role === 'admin'" to="/admin">Admin Dashboard</RouterLink>

      <LogoutButton />
    </div>
    <div v-else>
      <RouterLink to="/signup">Sign Up</RouterLink> |
      <RouterLink to="/login">Login</RouterLink>
    </div>

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import LogoutButton from "@/components/LogoutBtn.vue";


const authStore = useAuthStore();

onMounted(() => {
  authStore.initAuth();
});
</script>
