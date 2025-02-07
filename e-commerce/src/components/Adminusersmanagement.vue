<template>
  <div>
    <h2>Admin User Management</h2>
    <Addnewuser />
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td><input v-model="user.username" @change="updateUserInfo(user)" /></td>
          <td>{{ user.email }}</td>
          <td>
            <select v-model="user.role" @change="updateUserRole(user.id, user.role)">
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </td>
          <td>
            <button @click="deleteUser(user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
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
