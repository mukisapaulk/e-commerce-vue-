<template>
    <div class="container mx-auto p-6">
      <h2 class="text-2xl font-bold mb-4">User Profile</h2>
  
      <div v-if="userStore.userId">
        <!-- User Info -->
        <div class="bg-white p-4 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-2">Personal Information</h3>
          <div class="mb-2">
            <label class="block font-semibold">Name:</label>
            <input v-model="userStore.userProfile.name" class="border p-2 rounded w-full" />
          </div>
          <div class="mb-2">
            <label class="block font-semibold">Email:</label>
            <input v-model="userStore.userProfile.email" disabled class="border p-2 rounded w-full bg-gray-100" />
          </div>
          <div class="mb-2">
            <label class="block font-semibold">Phone:</label>
            <input v-model="userStore.userProfile.phone" class="border p-2 rounded w-full" />
          </div>
          <button @click="saveProfile" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Save Changes</button>
        </div>
  
        <!-- Addresses -->
        <div class="bg-white p-4 mt-4 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-2">Addresses</h3>
          <ul v-if="userStore.userProfile.addresses.length">
            <li v-for="(address, index) in userStore.userProfile.addresses" :key="index" class="border p-2 rounded mt-2 flex justify-between">
              <span>{{ address.street }}, {{ address.city }}, {{ address.state }} {{ address.zip }}</span>
              <button @click="removeAddress(index)" class="text-red-500 hover:text-red-700">Remove</button>
            </li>
          </ul>
          <button @click="addAddress" class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Add Address</button>
        </div>
  
        <!-- Payment Methods -->
        <div class="bg-white p-4 mt-4 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-2">Payment Methods</h3>
          <ul v-if="userStore.userProfile.paymentMethods.length">
            <li v-for="(method, index) in userStore.userProfile.paymentMethods" :key="index" class="border p-2 rounded mt-2 flex justify-between">
              <span>{{ method.type }} ending in {{ method.last4 }}</span>
              <button @click="removePaymentMethod(index)" class="text-red-500 hover:text-red-700">Remove</button>
            </li>
          </ul>
          <button @click="addPaymentMethod" class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Add Payment</button>
        </div>
  
        <!-- Preferences -->
        <div class="bg-white p-4 mt-4 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-2">Preferences</h3>
          <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="userStore.userProfile.preferences.notifications" />
            <span>Enable Notifications</span>
          </label>
          <button @click="saveProfile" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Save Preferences</button>
        </div>
  
        <!-- Delete Account -->
        <div class="bg-red-100 p-4 mt-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-red-600">Danger Zone</h3>
          <p class="text-sm text-gray-600">Deleting your account is irreversible. Your data will be permanently removed.</p>
          <button @click="confirmDeleteAccount" class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Delete Account</button>
        </div>
      </div>
  
      <!-- If User is Not Logged In -->
      <div v-else class="text-gray-600">Please log in to view your profile.</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useUserStore } from "@/stores/userStore";
  import { useRouter } from "vue-router";
  import { deleteUser } from "firebase/auth";
  
  const userStore = useUserStore();
  const router = useRouter();
  
  // Save profile changes
  const saveProfile = () => {
    userStore.saveUserProfile();
    alert("Profile updated successfully!");
  };
  
  // Address management
  const addAddress = () => {
    const newAddress = {
      street: "123 New St",
      city: "Example City",
      state: "EX",
      zip: "12345",
      country: "Example Country",
    };
    userStore.addAddress(newAddress);
  };
  
  const removeAddress = (index: number) => {
    if (confirm("Are you sure you want to remove this address?")) {
      userStore.removeAddress(index);
    }
  };
  
  // Payment method management
  const addPaymentMethod = () => {
    const newMethod = {
      type: "Credit Card",
      last4: "1234",
      expiry: "12/25",
    };
    userStore.addPaymentMethod(newMethod);
  };
  
  const removePaymentMethod = (index: number) => {
    if (confirm("Are you sure you want to remove this payment method?")) {
      userStore.removePaymentMethod(index);
    }
  };
  
  // Delete account function
  const confirmDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
  
    if (!userStore.userId) return;
  
    try {
      await deleteUser(userStore.userId); // Delete from Firebase Auth
      await userStore.resetUserProfile(); // Clear user store
      alert("Your account has been deleted.");
      router.push("/"); // Redirect to home
    } catch (error) {
      alert("Error deleting account: " + (error as Error).message);
    }
  };
  </script>
  