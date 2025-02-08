<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-900 mb-8">Your Cart</h2>

      <!-- Empty Cart Message -->
      <div v-if="cartStore.itemCount === 0" class="text-center text-gray-600">
        <p class="text-lg">Your cart is empty.</p>
        <RouterLink
          to="/"
          class="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Continue Shopping
        </RouterLink>
      </div>

      <!-- Cart Items List -->
      <div v-else>
        <ul class="space-y-4">
          <li
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex flex-col md:flex-row items-center justify-between p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <!-- Product Image -->
            <img
              :src="item.imageUrl"
              alt="Product Image"
              class="w-24 h-24 object-cover rounded-lg"
            />

            <!-- Item Details -->
            <div class="flex-1 md:ml-6 mt-4 md:mt-0">
              <p class="text-xl font-semibold text-gray-900">{{ item.name }}</p>
              <p class="text-gray-600 mt-1">Price: ${{ item.price.toFixed(2) }}</p>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center mt-4 md:mt-0">
              <button
                @click="decrementQuantity(item.id)"
                :disabled="item.quantity <= 1"
                class="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <input
                type="number"
                v-model="item.quantity"
                @change="updateQuantity(item.id, item.quantity)"
                :min="1"
                :max="item.stock"
                class="w-16 text-center border border-gray-300 mx-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                @click="incrementQuantity(item.id)"
                :disabled="item.quantity >= item.stock"
                class="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>

            <!-- Remove Button -->
            <button
              @click="removeItem(item.id)"
              class="mt-4 md:mt-0 text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </li>
        </ul>

        <!-- Cart Summary -->
        <div class="mt-8 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Cart Summary</h3>
          <div class="space-y-3">
            <p class="text-gray-700">Total Items: {{ cartStore.itemCount }}</p>
            <p class="text-gray-700">Subtotal: ${{ cartStore.subtotal.toFixed(2) }}</p>
            <p class="text-gray-700">Discount: -${{ cartStore.discountAmount.toFixed(2) }}</p>
            <p class="text-gray-700">
              Tax ({{ (cartStore.taxRate * 100).toFixed(0) }}%): ${{
                cartStore.taxAmount.toFixed(2)
              }}
            </p>
            <p class="text-2xl font-medium text-green-500">
              Total Price: ${{ cartStore.totalPrice.toFixed(2) }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              @click="clearCart"
              class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Clear Cart
            </button>
            <button
              @click="finishOrder"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
            >
              Finish Your Order
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

// Remove item from cart
const removeItem = (itemId: string) => {
  cartStore.removeItem(itemId)
}

// Clear entire cart
const clearCart = () => {
  cartStore.clearCart()
}

// Update item quantity in cart
const updateQuantity = (itemId: string, quantity: number) => {
  if (quantity > 0 && quantity <= (cartStore.items.find((i) => i.id === itemId)?.stock || 1)) {
    cartStore.updateItemQuantity(itemId, quantity)
  }
}

// Increase item quantity (respecting stock limits)
const incrementQuantity = (itemId: string) => {
  const item = cartStore.items.find((i) => i.id === itemId)
  if (item && item.quantity < item.stock) {
    cartStore.updateItemQuantity(itemId, item.quantity + 1)
  }
}

// Decrease item quantity (minimum 1)
const decrementQuantity = (itemId: string) => {
  const item = cartStore.items.find((i) => i.id === itemId)
  if (item && item.quantity > 1) {
    cartStore.updateItemQuantity(itemId, item.quantity - 1)
  }
}

// Check if the user is logged in before finishing the order
const finishOrder = () => {
  if (authStore.user) {
    router.push('/order')
  } else {
    router.push('/login')
  }
}
</script>
