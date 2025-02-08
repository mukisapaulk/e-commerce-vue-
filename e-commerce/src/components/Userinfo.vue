<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 p-6">
    <div class="w-full max-w-lg bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
      <!-- Header -->
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">User Profile</h2>
        <p class="text-gray-500 text-sm">View and update your profile details.</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center text-green-600">
        <svg class="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      </div>

      <!-- User Info Card -->
      <div v-else-if="!editing" class="space-y-4">
        <div class="border border-gray-200 rounded-xl p-4 bg-gray-100">
          <h3 class="text-lg font-semibold text-gray-900">Username</h3>
          <p class="text-gray-600">{{ user.username }}</p>
        </div>
        <div class="border border-gray-200 rounded-xl p-4 bg-gray-100">
          <h3 class="text-lg font-semibold text-gray-900">Email</h3>
          <p class="text-gray-600">{{ user.email }}</p>
        </div>
        <div class="border border-gray-200 rounded-xl p-4 bg-gray-100">
          <h3 class="text-lg font-semibold text-gray-900">Role</h3>
          <p class="text-gray-600">{{ user.role }}</p>
        </div>
        <button
          @click="editing = true"
          class="w-full px-6 py-2 mt-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
        >
          Edit Profile
        </button>
      </div>

      <!-- Edit Profile Form -->
      <div v-else class="space-y-4">
        <!-- Username -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Username</label>
          <input
            v-model="user.username"
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-600"
          />
        </div>

        <!-- Email (Read-Only) -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="user.email"
            disabled
            class="mt-1 w-full px-4 py-2 border border-gray-300 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
          />
        </div>

        <!-- Role Selector -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Role</label>
          <select
            v-model="user.role"
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-600"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between mt-6">
          <button
            @click="editing = false"
            class="px-6 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            @click="updateUserInfo"
            class="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>

      <!-- Delete Account Button -->
      <div class="mt-6">
        <button
          @click="deleteAccount"
          class="w-full px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
        >
          Delete Account
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { db, doc, getDoc, updateDoc, deleteDoc } from '../../Firebase/index'
import { useRouter } from 'vue-router'

// Define User Type
interface User {
  id?: string
  username: string
  email: string
  role: 'customer' | 'admin'
}

// State
const authStore = useAuthStore()
const router = useRouter()
const user = ref<User>({ username: '', email: '', role: 'customer' })
const loading = ref<boolean>(true)
const errorMessage = ref<string>('')
const editing = ref<boolean>(false)

// Fetch User Data
onMounted(async () => {
  try {
    const userId = authStore.user?.uid
    if (!userId) throw new Error('User not found')

    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      user.value = { ...userDoc.data(), id: userId } as User
    } else {
      throw new Error('User data not found')
    }
  } catch (error) {
    errorMessage.value = (error as Error).message
  } finally {
    loading.value = false
  }
})

// Update User Info
const updateUserInfo = async (): Promise<void> => {
  try {
    if (!user.value.id) throw new Error('User ID missing')

    await updateDoc(doc(db, 'users', user.value.id), {
      username: user.value.username,
      role: user.value.role,
    })

    alert('Profile updated successfully!')
    editing.value = false
  } catch (error) {
    errorMessage.value = (error as Error).message
  }
}

// Delete Account
const deleteAccount = async (): Promise<void> => {
  try {
    if (!user.value.id) throw new Error('User ID missing')

    await deleteDoc(doc(db, 'users', user.value.id))
    await authStore.signOut() // Sign out user after deletion
    router.push('/login') // Redirect to login
  } catch (error) {
    errorMessage.value = (error as Error).message
  }
}
</script>
