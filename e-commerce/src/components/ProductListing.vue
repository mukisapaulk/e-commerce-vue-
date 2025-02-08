<template>
  <div class="container mx-auto p-6">
    <!-- Header Section -->
    <div class="pt-15 pb-5">
      <h1 class="text-5xl font-bold text-gray-800">Product Categories</h1>
      <p class="text-gray-600 pt-3">Explore our wide range of products</p>
    </div>

    <!-- Search Section -->
    <div class="mt-8">
      <input
        v-model="searchQuery"
        class="w-lg outline-inherit p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400"
        placeholder="Search for products..."
      />
    </div>

    <!-- Categories Section -->
    <div class="mt-6 flex flex-wrap gap-4">
      <button
        @click="selectedCategory = ''"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 rounded-lg hover:bg-gray-200"
        :class="{
          'bg-yellow-400 text-white': selectedCategory === '',
        }"
      >
        <i class="fas fa-tags"></i>
        All Categories
      </button>
      <button
        v-for="category in categories"
        :key="category.name"
        @click="selectedCategory = category.name"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg hover:opacity-90"
        :class="category.class"
        :style="selectedCategory === category.name ? category.activeStyle : ''"
      >
        <i :class="category.icon"></i>
        {{ category.name }}
      </button>
    </div>

    <!-- Product Grid -->
    <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white border border-gray-50 rounded-lg shadow-lg p-3 hover:shadow-xl transition"
      >
        <!-- Product Image -->
        <div class="relative">
          <img :src="product.imageUrl" alt="Product" class="w-full h-50 object-cover rounded-lg" />
          <span
            class="absolute top-2 left-2 px-3 py-1 text-xs text-white bg-yellow-500 rounded-full shadow-sm"
          >
            {{ product.category }}
          </span>
        </div>

        <!-- Product Info -->
        <div class="mt-4">
          <h3 class="text-lg font-semibold text-gray-800">{{ product.name }}</h3>
          <p class="text-gray-600 mt-1">${{ product.price }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="mt-4 flex justify-between items-center">
          <router-link
            :to="`/product/${product.id}`"
            class="text-sm font-medium text-blue-500 hover:underline"
          >
            View Details
          </router-link>
          <button
            @click="addToCart(product)"
            class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'

const productStore = useProductStore()
const cartStore = useCartStore()
const searchQuery = ref('')
const selectedCategory = ref('')

const categories = ref([
  {
    name: 'Apparel & Accessories',
    icon: 'fas fa-tshirt',
    class: 'bg-blue-100 text-blue-800',
    activeStyle: 'background-color: #1D4ED8; color: #fff',
  },
  {
    name: 'Electronics & Computers',
    icon: 'fas fa-laptop',
    class: 'bg-green-100 text-green-800',
    activeStyle: 'background-color: #047857; color: #fff',
  },
  {
    name: 'Beauty & Personal Care',
    icon: 'fas fa-magic',
    class: 'bg-pink-100 text-pink-800',
    activeStyle: 'background-color: #DB2777; color: #fff',
  },
  {
    name: 'Sports & Outdoors',
    icon: 'fas fa-football-ball',
    class: 'bg-yellow-100 text-yellow-800',
    activeStyle: 'background-color: #F59E0B; color: #fff',
  },
  {
    name: 'Toys & Hobbies',
    icon: 'fas fa-puzzle-piece',
    class: 'bg-purple-100 text-purple-800',
    activeStyle: 'background-color: #7E22CE; color: #fff',
  },
  {
    name: 'Food & Beverages',
    icon: 'fas fa-utensils',
    class: 'bg-red-100 text-red-800',
    activeStyle: 'background-color: #B91C1C; color: #fff',
  },
])

onMounted(() => {
  productStore.fetchProducts()
})

const filteredProducts = computed(() => {
  return productStore.products.filter((product) => {
    return (
      (selectedCategory.value === '' || product.category === selectedCategory.value) &&
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

// Add to Cart Function
const addToCart = (product) => {
  cartStore.addItem(product)
}
</script>

<style scoped>
/* For FontAwesome icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
</style>
