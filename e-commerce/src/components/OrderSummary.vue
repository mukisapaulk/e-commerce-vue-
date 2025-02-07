<template>
    <div class="order-summary-container">
      <h2 class="text-2xl font-bold mb-4">Order Summary</h2>
  
      <!-- Order Details -->
      <div v-if="orderStore.order">
        <div class="order-details">
          <p><strong>Full Name:</strong> {{ orderStore.order.fullName }}</p>
          <p><strong>Email:</strong> {{ orderStore.order.email }}</p>
          <p><strong>Phone:</strong> {{ orderStore.order.phone }}</p>
          <p><strong>Address:</strong> {{ orderStore.order.address }}</p>
          
          <h3 class="mt-4 text-lg font-semibold">Items:</h3>
          <ul>
            <li v-for="item in orderStore.order.items" :key="item.id">
              {{ item.name }} - {{ item.quantity }} x ${{ item.price.toFixed(2) }} = ${{ (item.quantity * item.price).toFixed(2) }}
            </li>
          </ul>
  
          <p class="mt-4"><strong>Total: </strong>${{ orderStore.order.total.toFixed(2) }}</p>
  
          <!-- Payment Button -->
          <button @click="initiatePayment" class="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
            Pay Now
          </button>
        </div>
      </div>
      <div v-else>
        <p>No order found.</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useOrderStore } from "@/stores/orderStore"; // Adjust path if needed
  import { ref, onMounted } from "vue";
  
  // Order Store
  const orderStore = useOrderStore();
  
  // Fetch the order details (e.g., after placing the order)
  onMounted(() => {
    // Ensure the order is loaded, either from store or database
    if (!orderStore.order) {
      // Optionally fetch the order if it's not available yet
      orderStore.fetchOrder(); // Define this action in your order store
    }
  });
  
  // Payment initiation function
  const initiatePayment = async () => {
    // Call your backend to create a payment session (e.g., Stripe or PayPal)
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderStore.order.id,
        total: orderStore.order.total,
      }),
    });
  
    const session = await response.json();
  
    // Redirect to the payment gateway (Stripe, for example)
    const stripe = Stripe(session.stripePublicKey); // Assuming stripePublicKey is returned
    stripe.redirectToCheckout({ sessionId: session.id });
  };
  </script>
  