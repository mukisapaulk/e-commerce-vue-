<template>
  <div>
    <h1>Vue + Firebase Auth</h1>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/cart">Cart</RouterLink>
    <!-- Admin-only Links -->
    <RouterLink v-if="authStore.role === 'admin'" to="/admin">Dashboard</RouterLink>
    <RouterLink v-if="authStore.role === 'admin'" to="/adminproduct">Products</RouterLink>
    <RouterLink v-if="authStore.role === 'admin'" to="/adminuser">User</RouterLink>

    <div v-if="authStore.user">
      <p>Welcome, {{ authStore.username || authStore.user.email }}</p>
      <p>
        Role: <strong>{{ authStore.role }}</strong>
      </p>

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
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import LogoutButton from '@/components/LogoutBtn.vue'

const authStore = useAuthStore()
const cartStore = useCartStore()

onMounted(() => {
  authStore.initAuth() // Initialize authentication
  cartStore.initCart() // Initialize cart (syncs with localStorage or Firebase)
})
</script>
