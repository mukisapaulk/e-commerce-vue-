<template>
  <div class="container mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Your Cart</h2>

    <!-- Empty Cart Message -->
    <div v-if="cartStore.itemCount === 0" class="text-gray-600">
      <p>Your cart is empty.</p>
    </div>

    <!-- Cart Items List -->
    <div v-else>
      <ul class="space-y-4">
        <li v-for="item in cartStore.items" :key="item.id" class="flex items-center justify-between p-4 border rounded-lg shadow-md bg-white">
          <!-- Product Image -->
          <img :src="item.imageUrl" alt="Product Image" class="w-16 h-16 object-cover rounded" />

          <!-- Item Details -->
          <div class="flex-1 ml-4">
            <p class="text-lg font-semibold">{{ item.name }}</p>
            <p class="text-gray-600">Price: ${{ item.price.toFixed(2) }}</p>
          </div>

          <!-- Quantity Controls -->
          <div class="flex items-center">
            <button @click="decrementQuantity(item.id)" :disabled="item.quantity <= 1" class="px-2 py-1 bg-gray-300 text-black rounded disabled:opacity-50">-</button>
            <input 
              type="number" 
              v-model="item.quantity" 
              @change="updateQuantity(item.id, item.quantity)" 
              :min="1" 
              :max="item.stock" 
              class="w-12 text-center border mx-2" 
            />
            <button @click="incrementQuantity(item.id)" :disabled="item.quantity >= item.stock" class="px-2 py-1 bg-gray-300 text-black rounded disabled:opacity-50">+</button>
          </div>

          <!-- Remove Button -->
          <button @click="removeItem(item.id)" class="text-red-500 hover:text-red-700">Remove</button>
        </li>
      </ul>

      <!-- Cart Summary -->
      <div class="mt-6 p-4 border rounded-lg shadow-md bg-white">
        <p class="text-lg font-semibold">Cart Summary</p>
        <p>Total Items: {{ cartStore.itemCount }}</p>
        <p>Subtotal: ${{ cartStore.subtotal.toFixed(2) }}</p>
        <p>Discount: -${{ cartStore.discountAmount.toFixed(2) }}</p>
        <p>Tax ({{ (cartStore.taxRate * 100).toFixed(0) }}%): ${{ cartStore.taxAmount.toFixed(2) }}</p>
        <p class="text-xl font-bold">Total Price: ${{ cartStore.totalPrice.toFixed(2) }}</p>

        <button @click="clearCart" class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
          Clear Cart
        </button>
        <button>
          <RouterLink to="/order">finish your order</RouterLink>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "@/stores/cartStore"; // Adjust the path if needed

const cartStore = useCartStore();

// Remove item from cart
const removeItem = (itemId: string) => {
  cartStore.removeItem(itemId);
};

// Clear entire cart
const clearCart = () => {
  cartStore.clearCart();
};

// Update item quantity in cart
const updateQuantity = (itemId: string, quantity: number) => {
  if (quantity > 0 && quantity <= (cartStore.items.find(i => i.id === itemId)?.stock || 1)) {
    cartStore.updateItemQuantity(itemId, quantity);
  }
};

// Increase item quantity (respecting stock limits)
const incrementQuantity = (itemId: string) => {
  const item = cartStore.items.find(i => i.id === itemId);
  if (item && item.quantity < item.stock) {
    cartStore.updateItemQuantity(itemId, item.quantity + 1);
  }
};

// Decrease item quantity (minimum 1)
const decrementQuantity = (itemId: string) => {
  const item = cartStore.items.find(i => i.id === itemId);
  if (item && item.quantity > 1) {
    cartStore.updateItemQuantity(itemId, item.quantity - 1);
  }
};
</script>
