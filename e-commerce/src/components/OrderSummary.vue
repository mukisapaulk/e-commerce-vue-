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
            {{ item.name }} - {{ item.quantity }} x ${{ item.price.toFixed(2) }} = ${{
              (item.quantity * item.price).toFixed(2)
            }}
          </li>
        </ul>

        <p class="mt-4"><strong>Total: </strong>${{ orderStore.order.total.toFixed(2) }}</p>

        <!-- Payment Button -->
        <button
          @click="initiatePayment"
          class="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
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
import { useOrderStore } from '@/stores/orderStore' // Adjust path if needed
import { ref, onMounted } from 'vue'

// Import Stripe type
import { loadStripe, Stripe } from '@stripe/stripe-js'

// Order Item Type
interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

// Order Type
interface Order {
  id: string
  fullName: string
  email: string
  phone: string
  address: string
  items: OrderItem[]
  total: number
}

// Payment Session Response Type
interface PaymentSession {
  id: string
  stripePublicKey: string
}

// Order Store
const orderStore = useOrderStore()

// Fetch the order details (e.g., after placing the order)
onMounted(() => {
  // Ensure the order is loaded, either from store or database
  if (!orderStore.order) {
    orderStore.fetchOrder() // Ensure this method exists in the store
  }
})

// Payment initiation function
const initiatePayment = async () => {
  if (!orderStore.order) {
    console.error('Order is not available')
    return
  }

  try {
    // Call your backend to create a payment session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderStore.order.id,
        total: orderStore.order.total,
      }),
    })

    if (!response.ok) throw new Error('Failed to create payment session')

    const session: PaymentSession = await response.json()

    // Initialize Stripe
    const stripe: Stripe | null = await loadStripe(session.stripePublicKey)
    if (!stripe) throw new Error('Stripe failed to initialize')

    // Redirect to the payment gateway
    await stripe.redirectToCheckout({ sessionId: session.id })
  } catch (error) {
    console.error('Payment error:', error)
  }
}
</script>
