<template>
  <div class="container mx-auto flex justify-center items-center py-8 px-4">
    <div
      v-if="product"
      class="grid grid-cols-1 md:grid-cols-2 bg-yellow-100 rounded-xl shadow-lg max-w-4xl overflow-hidden"
    >
      <!-- Product Image -->
      <div class="bg-white flex items-center justify-center p-6">
        <img
          :src="product.imageUrl"
          :alt="product.name"
          class="w-[250px] h-auto object-contain transition-transform duration-300 hover:scale-110"
        />
      </div>

      <!-- Product Details -->
      <div class="bg-yellow-100 p-6 flex flex-col justify-between">
        <!-- Product Title -->
        <div>
          <h2 class="text-2xl font-bold text-gray-800">{{ product.name }}</h2>
          <p class="text-gray-600 mt-2">{{ product.description }}</p>
        </div>

        <!-- Category & Stock -->
        <div class="mt-4">
          <p class="text-sm font-medium text-gray-600">
            <span class="font-medium text-gray-700 p-1 rounded-xl border-1 border-solid">{{
              product.category
            }}</span>
          </p>
          <p
            class="text-sm font-medium mt-1 p-2"
            :class="product.stock > 0 ? 'text-black-500' : 'text-red-600'"
          >
            <span class="font-medium">{{
              product.stock > 0 ? product.stock : 'Out of stock'
            }}</span>
            Instock
          </p>
        </div>

        <!-- Price -->
        <div class="mt-4">
          <div class="text-3xl font-bold text-green-600">${{ product.price }}</div>
        </div>

        <!-- Action Button -->
        <button
          @click="addToCart"
          class="mt-6 w-full px-6 py-3 bg-gray-900 text-white text-center rounded-lg font-semibold transition-colors hover:bg-gray-700 focus:ring focus:ring-yellow-400"
        >
          Add to Cart
        </button>
      </div>
    </div>

    <!-- Loading Message -->
    <div v-else class="text-center text-gray-500 py-10">
      <p>Loading product...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'

// Define product type
interface Product {
  id: string
  name: string
  price: number
  stock: number
  imageUrl: string
  description: string
  category: string
}

// Stores
const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()

// Reactive variables
const product = ref<Product | null>(null)
const quantity = ref<number>(1)

// Fetch product on mount
onMounted(async () => {
  await productStore.fetchProducts()
  product.value = productStore.products.find((p: Product) => p.id === route.params.id) || null
})

// Add to cart function
const addToCart = (): void => {
  if (product.value) {
    cartStore.addItem({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      quantity: quantity.value,
      imageUrl: product.value.imageUrl,
      stock: product.value.stock,
    })
  }
}
</script>
