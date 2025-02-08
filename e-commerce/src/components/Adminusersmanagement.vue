<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Add New User Component -->
      <Addnewuser class="mb-8" />

      <!-- Admin User Management Section -->
      <h2 class="text-3xl font-bold text-gray-900 mb-6">Admin User Management</h2>

      <!-- User Table -->
      <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table Header -->
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
              >
                Username
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <!-- Username -->
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  v-model="user.username"
                  @change="updateUserInfo(user)"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </td>

              <!-- Email -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ user.email }}
              </td>

              <!-- Role -->
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  v-model="user.role"
                  @change="updateUserRole(user.id, user.role)"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="deleteUser(user.id)"
                  class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { db, doc, getDocs, updateDoc, deleteDoc, collection } from '../../Firebase/index'
import { useToast } from 'vue-toast-notification'
import Addnewuser from './Addnewuser.vue'

const authStore = useAuthStore()
const users = ref([])
const toast = useToast()

// Fetch all users from Firestore
const fetchUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'))
  users.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// Update user role
const updateUserRole = async (userId, newRole) => {
  if (authStore.role !== 'admin') return
  try {
    await updateDoc(doc(db, 'users', userId), { role: newRole })
    toast.success('User role updated successfully!')
  } catch (error) {
    toast.error('Failed to update user role!')
  }
}

// Update user info (username)
const updateUserInfo = async (user) => {
  if (authStore.role !== 'admin') return
  try {
    await updateDoc(doc(db, 'users', user.id), { username: user.username })
    toast.success('User info updated successfully!')
  } catch (error) {
    toast.error('Failed to update user info!')
  }
}

// Delete user
const deleteUser = async (userId) => {
  if (authStore.role !== 'admin') return
  try {
    await deleteDoc(doc(db, 'users', userId))
    users.value = users.value.filter((user) => user.id !== userId)
    toast.success('User deleted successfully!')
  } catch (error) {
    toast.error('Failed to delete user!')
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f4f4f4;
}
</style>
