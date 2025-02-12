import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('../components/Productdetails.vue'),
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('../components/Order.vue'),
    },
    {
      path: '/userprofile',
      name: 'userprofile',
      component: () => import('../components/Userprofile.vue'),
    },

    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../components/Signup.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/Login.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../components/Cart.vue'),
    },
    {
      path: '/userprofile',
      name: 'userprofile',
      component: () => import('../components/Userprofile.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' }, // Protect this route with role and auth
    },
    {
      path: '/adminproduct',
      name: 'adminproducts',
      component: () => import('../components/Adminproducts.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' }, // Protect this route with role and auth
    },
    {
      path: '/adminuser',
      name: 'adminusermanagement',
      component: () => import('../components/Adminusersmanagement.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' }, // Protect this route with role and auth
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // If route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.user) {
      // If user is not authenticated, redirect to login
      next('/login')
      return
    }

    // Fetch the role if it's not already set
    if (!authStore.role) {
      await authStore.fetchUserRole(authStore.user.uid)
    }

    // If route requires a specific role (e.g., admin)
    if (to.meta.requiresRole && authStore.role !== to.meta.requiresRole) {
      // If user doesn't have the required role, redirect to home or a different route
      next('/')
      return
    }
  }

  next() // Allow access if checks pass
})

export default router
