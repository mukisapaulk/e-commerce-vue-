<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Place Your Order</h1>

      <!-- Empty Cart Message -->
      <div v-if="cartStore.itemCount === 0" class="text-center text-gray-600">
        <p class="text-lg">Your cart is empty. Add items before placing an order.</p>
        <RouterLink
          to="/"
          class="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Continue Shopping
        </RouterLink>
      </div>

      <!-- Order Content -->
      <div v-else class="space-y-8">
        <!-- Order Summary -->
        <div class="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
          <ul class="space-y-4">
            <li
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex justify-between items-center border-b pb-4"
            >
              <div class="flex-1">
                <p class="text-lg font-semibold text-gray-700">{{ item.name }}</p>
                <p class="text-gray-600">Quantity: {{ item.quantity }}</p>
              </div>
              <p class="text-lg font-medium text-green-500">
                ${{ (item.price * item.quantity).toFixed(2) }}
              </p>
            </li>
          </ul>
          <p class="mt-6 text-xl font-bold text-green-600">
            Total: ${{ cartStore.totalPrice.toFixed(2) }}
          </p>
        </div>

        <!-- Shipping Details Form -->
        <form
          @submit.prevent="placeOrder"
          class="bg-white p-6 border border-gray-200 rounded-lg shadow-sm"
        >
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Shipping Details</h2>

          <div class="space-y-4">
            <!-- Full Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                v-model="order.fullName"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="order.email"
                type="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <!-- Phone Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                v-model="order.phone"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <!-- Shipping Address -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
              <textarea
                v-model="order.address"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>
          </div>

          <!-- Place Order Button -->
          <button
            type="submit"
            class="mt-6 w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useOrderStore } from '@/stores/orderStore'

const cartStore = useCartStore()
const orderStore = useOrderStore()

const order = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
})

const placeOrder = async () => {
  if (!cartStore.items.length) return

  const orderData = {
    ...order.value,
    items: cartStore.items,
    total: cartStore.totalPrice,
    createdAt: new Date().toISOString(),
  }

  await orderStore.submitOrder(orderData)
  cartStore.clearCart()
  alert('Your order has been placed successfully!')
}
</script>
