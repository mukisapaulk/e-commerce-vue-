<template>
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-4">Place Your Order</h1>
  
      <!-- Display Cart Items -->
      <div v-if="cartStore.itemCount === 0" class="text-gray-500">
        <p>Your cart is empty. Add items before placing an order.</p>
      </div>
  
      <div v-else>
        <!-- Order Summary -->
        <div class="border p-4 rounded shadow mb-6">
          <h2 class="text-xl font-semibold mb-2">Order Summary</h2>
          <ul>
            <li v-for="item in cartStore.items" :key="item.id" class="border-b py-2">
              <div class="flex justify-between">
                <span>{{ item.name }} (x{{ item.quantity }})</span>
                <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </li>
          </ul>
          <p class="mt-4 font-semibold">Total: ${{ cartStore.totalPrice.toFixed(2) }}</p>
        </div>
  
        <!-- Shipping Details Form -->
        <form @submit.prevent="placeOrder" class="border p-4 rounded shadow">
          <h2 class="text-xl font-semibold mb-2">Shipping Details</h2>
  
          <div class="mb-3">
            <label class="block text-gray-700">Full Name:</label>
            <input v-model="order.fullName" type="text" required class="w-full p-2 border rounded" />
          </div>
  
          <div class="mb-3">
            <label class="block text-gray-700">Email:</label>
            <input v-model="order.email" type="email" required class="w-full p-2 border rounded" />
          </div>
  
          <div class="mb-3">
            <label class="block text-gray-700">Phone Number:</label>
            <input v-model="order.phone" type="text" required class="w-full p-2 border rounded" />
          </div>
  
          <div class="mb-3">
            <label class="block text-gray-700">Shipping Address:</label>
            <textarea v-model="order.address" required class="w-full p-2 border rounded"></textarea>
          </div>
  
          <button type="submit" class="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-800 w-full">
            Place Order
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { useCartStore } from "@/stores/cartStore";
  import { useOrderStore } from "@/stores/orderStore";
  
  const cartStore = useCartStore();
  const orderStore = useOrderStore();
  
  const order = ref({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  
  const placeOrder = async () => {
    if (!cartStore.items.length) return;
  
    const orderData = {
      ...order.value,
      items: cartStore.items,
      total: cartStore.totalPrice,
      createdAt: new Date().toISOString(),
    };
  
    await orderStore.submitOrder(orderData);
    cartStore.clearCart();
    alert("Your order has been placed successfully!");
  };
  </script>
  