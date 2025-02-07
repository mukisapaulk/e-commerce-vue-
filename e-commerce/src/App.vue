<template>
  <div>
    <h1>Vue + Firebase Auth</h1>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/cart">cart</RouterLink>
      
    <div v-if="authStore.user">
      <p>Welcome, {{ authStore.user.displayName || authStore.user.email }}</p>
      <p>Role: <strong>{{ authStore.role }}</strong></p>
      
      <!-- Admin-only Link -->
      <RouterLink v-if="authStore.role === 'admin'" to="/admin">Admin Dashboard</RouterLink>
      <RouterLink v-if="authStore.role === 'admin'" to="/adminproduct">Admin products</RouterLink>

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
import { useCartStore } from "@/stores/cartStore";
import LogoutButton from "@/components/LogoutBtn.vue";

const authStore = useAuthStore();
const cartStore = useCartStore();

onMounted(() => {
  authStore.initAuth(); // Initialize authentication
  cartStore.initCart(); // Initialize cart (syncs with localStorage or Firebase)
});
</script>


