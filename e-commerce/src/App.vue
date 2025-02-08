<template>
  <header class="bg-white shadow-lg">
    <div class="container mx-auto flex justify-between items-center py-4 px-6">
      <!-- Logo -->
      <RouterLink to="/" class="text-3xl font-extrabold text-gray-900 flex items-center">
        <span class="text-yellow-500">the</span> store
      </RouterLink>

      <!-- Navigation -->
      <nav class="hidden md:flex space-x-4 items-center ">
        <RouterLink to="/" class="hover:text-yellow-500 font-medium">Home</RouterLink>
        <RouterLink to="/cart" class="hover:text-yellow-500 relative font-medium">
          Cart
          <span
            v-if="cartStore.itemCount > 0"
            class="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
          >
            {{ cartStore.itemCount }}
          </span>
        </RouterLink>

        <!-- Admin-only Links -->
        <template v-if="authStore.role === 'admin'">
          <RouterLink to="/adminproduct" class="hover:text-yellow-500 font-medium">Products</RouterLink>
          <RouterLink to="/adminuser" class="hover:text-yellow-500 font-medium">Users</RouterLink>
        </template>

        <!-- User Profile & Authentication -->
        <template v-if="authStore.user">
          <RouterLink to="/userprofile" class="hover:text-yellow-500 flex items-center font-medium">
            <UserIcon class="w-5 h-5 mr-1" />
            Profile
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink
            to="/signup"
            class=" font-bold px-4 py-1 bg-yellow-600 text-white rounded-xl shadow-md hover:bg-yellow-700 transition-all"
          >
            Sign Up
          </RouterLink>
          <RouterLink
            to="/login"
            class="px-4 py-1 bg-gray-500 text-white rounded-xl shadow-md hover:bg-gray-700 transition-all font-medium"
          >
            Login
          </RouterLink>
        </template>
      </nav>

      <!-- Mobile Menu -->
      <button @click="toggleMobileMenu" class="md:hidden text-gray-700 dark:text-gray-300">
        <MenuIcon class="w-6 h-6" />
      </button>

      <!-- Mobile Dropdown -->
      <div
        v-if="mobileMenuOpen"
        class="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg md:hidden"
      >
        <nav class="flex flex-col space-y-2 p-4">
          <RouterLink to="/" class="mobile-link">Home</RouterLink>
          <RouterLink to="/cart" class="mobile-link">Cart</RouterLink>

          <template v-if="authStore.role === 'admin'">
            <RouterLink to="/adminproduct" class="mobile-link">Products</RouterLink>
            <RouterLink to="/adminuser" class="mobile-link">Users</RouterLink>
          </template>

          <template v-if="authStore.user">
            <RouterLink to="/userprofile" class="mobile-link">Profile</RouterLink>
          </template>
          <template v-else>
            <RouterLink to="/signup" class="mobile-link">Sign Up</RouterLink>
            <RouterLink to="/login" class="mobile-link">Login</RouterLink>
          </template>
        </nav>
      </div>
    </div>
  </header>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
// import LogoutButton from '@/components/LogoutBtn.vue'
import { ref } from 'vue'
import { MenuIcon, UserIcon } from 'lucide-vue-next'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const authStore = useAuthStore()
const cartStore = useCartStore()

onMounted(() => {
  authStore.initAuth() // Initialize authentication
  cartStore.initCart() // Initialize cart (syncs with localStorage or Firebase)
})
</script>
