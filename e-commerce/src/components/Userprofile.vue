<template>
    <div class="container mx-auto p-6">
      <h2 class="text-2xl font-bold mb-4">User Profile</h2>
  
      <!-- Loading State -->
      <div v-if="userStore.loading" class="text-gray-600">Loading profile...</div>
  
      <!-- If Not Logged In -->
      <div v-else-if="!userStore.userId" class="text-gray-600">
        Please log in to view your profile.
      </div>
  
      <!-- User Profile Form -->
      <div v-else class="bg-white p-6 shadow-md rounded-md">
        <!-- Basic Info -->
        <div class="mb-4">
          <label class="block text-gray-700">Name</label>
          <input v-model="userStore.userProfile.name" type="text" class="border w-full p-2 rounded" />
        </div>
  
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="userStore.userProfile.email" type="email" class="border w-full p-2 rounded" disabled />
        </div>
  
        <div class="mb-4">
          <label class="block text-gray-700">Phone</label>
          <input v-model="userStore.userProfile.phone" type="text" class="border w-full p-2 rounded" />
        </div>
  
        <button @click="userStore.saveUserProfile" class="bg-blue-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>
  
        <!-- Addresses Section -->
        <div class="mt-6">
          <h3 class="text-lg font-semibold">Addresses</h3>
          <ul class="mt-2">
            <li v-for="(address, index) in userStore.userProfile.addresses" :key="index" class="border p-2 rounded mb-2">
              {{ address.street }}, {{ address.city }}, {{ address.state }}, {{ address.zip }}, {{ address.country }}
              <button @click="userStore.removeAddress(index)" class="text-red-500 ml-2">Remove</button>
            </li>
          </ul>
          <div class="mt-2 flex gap-2">
            <input v-model="newAddress.street" type="text" placeholder="Street" class="border p-2 rounded w-full" />
            <input v-model="newAddress.city" type="text" placeholder="City" class="border p-2 rounded w-full" />
          </div>
          <div class="mt-2 flex gap-2">
            <input v-model="newAddress.state" type="text" placeholder="State" class="border p-2 rounded w-full" />
            <input v-model="newAddress.zip" type="text" placeholder="Zip" class="border p-2 rounded w-full" />
            <input v-model="newAddress.country" type="text" placeholder="Country" class="border p-2 rounded w-full" />
          </div>
          <button @click="addNewAddress" class="bg-green-500 text-white px-4 py-2 rounded mt-2">
            Add Address
          </button>
        </div>
  
        <!-- Payment Methods Section -->
        <div class="mt-6">
          <h3 class="text-lg font-semibold">Payment Methods</h3>
          <ul class="mt-2">
            <li v-for="(payment, index) in userStore.userProfile.paymentMethods" :key="index" class="border p-2 rounded mb-2">
              {{ payment.type }} - **** {{ payment.last4 }} (Exp: {{ payment.expiry }})
              <button @click="userStore.removePaymentMethod(index)" class="text-red-500 ml-2">Remove</button>
            </li>
          </ul>
          <div class="mt-2 flex gap-2">
            <input v-model="newPaymentMethod.type" type="text" placeholder="Payment Type" class="border p-2 rounded w-full" />
            <input v-model="newPaymentMethod.last4" type="text" placeholder="Last 4 Digits" class="border p-2 rounded w-full" />
            <input v-model="newPaymentMethod.expiry" type="text" placeholder="Expiry (MM/YY)" class="border p-2 rounded w-full" />
          </div>
          <button @click="addNewPaymentMethod" class="bg-green-500 text-white px-4 py-2 rounded mt-2">
            Add Payment Method
          </button>
        </div>
  
        <!-- Preferences Section -->
        <div class="mt-6">
          <h3 class="text-lg font-semibold">Preferences</h3>
          <label class="block mt-2">
            <input type="checkbox" v-model="userStore.userProfile.preferences.notifications" class="mr-2" />
            Enable Notifications
          </label>
          <label class="block mt-2">
            <select v-model="userStore.userProfile.preferences.theme" class="border p-2 rounded w-full">
              <option value="light">Light Theme</option>
              <option value="dark">Dark Theme</option>
            </select>
          </label>
          <button @click="userStore.updatePreferences(userStore.userProfile.preferences)" class="bg-blue-500 text-white px-4 py-2 rounded mt-2">
            Save Preferences
          </button>
        </div>
  
        <!-- Delete Account -->
        <button @click="confirmDelete" class="bg-red-500 text-white px-4 py-2 rounded mt-6">
          Delete Account
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useUserStore } from "@/stores/userStore";
  import { ref, onMounted } from "vue";
  
  const userStore = useUserStore();
  
  // Load user data when component mounts
  onMounted(async () => {
    await userStore.initUser();
  });
  
  // New address input
  const newAddress = ref({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  
  // Add a new address
  const addNewAddress = () => {
    if (!newAddress.value.street || !newAddress.value.city || !newAddress.value.zip) return;
    userStore.addAddress({ ...newAddress.value });
    newAddress.value = { street: "", city: "", state: "", zip: "", country: "" };
  };
  
  // New payment method input
  const newPaymentMethod = ref({
    type: "",
    last4: "",
    expiry: "",
  });
  
  // Add a new payment method
  const addNewPaymentMethod = () => {
    if (!newPaymentMethod.value.type || !newPaymentMethod.value.last4 || !newPaymentMethod.value.expiry) return;
    userStore.addPaymentMethod({ ...newPaymentMethod.value });
    newPaymentMethod.value = { type: "", last4: "", expiry: "" };
  };
  
  // Confirm account deletion
  const confirmDelete = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      userStore.deleteUserAccount();
    }
  };
  </script>
  