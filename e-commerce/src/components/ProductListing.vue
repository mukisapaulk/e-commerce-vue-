<template>
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-4">Products</h1>
  
      <!-- Search Bar -->
      <input v-model="searchQuery" class="w-full p-2 mb-4 border" placeholder="Search products..." />
  
      <!-- Category Filter -->
      <select v-model="selectedCategory" class="w-full p-2 mb-4 border">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
  
      <!-- Product Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="product in filteredProducts" :key="product.id" class="border p-4 rounded shadow">
          <img :src="product.imageUrl" alt="Product" class="w-full h-40 object-cover mb-2" />
          <h3 class="text-lg font-semibold">{{ product.name }}</h3>
          <p class="text-gray-600">Price: ${{ product.price }}</p>
          <p class="text-gray-600">Category: {{ product.category }}</p>
  
          <div class="mt-2 flex items-center justify-between">
            <router-link :to="`/product/${product.id}`" class="text-blue-500">View Details</router-link>
            <button @click="addToCart(product)" class="bg-green-500 text-white px-3 py-1 rounded">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import { useProductStore } from "@/stores/productStore";
  import { useCartStore } from "@/stores/cartStore";
  
  const productStore = useProductStore();
  const cartStore = useCartStore();
  const searchQuery = ref("");
  const selectedCategory = ref("");
  
  const categories = [
    "Apparel & Accessories",
    "Electronics & Computers",
    "Home & Garden",
    "Beauty & Personal Care",
    "Books, Movies & Music",
    "Sports & Outdoors",
    "Toys & Hobbies",
    "Food & Beverages",
    "Automotive",
  ];
  
  onMounted(() => {
    productStore.fetchProducts();
  });
  
  const filteredProducts = computed(() => {
    return productStore.products.filter((product) => {
      return (
        (selectedCategory.value === "" || product.category === selectedCategory.value) &&
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });
  });
  
  // Add to Cart Function
  const addToCart = (product) => {
    cartStore.addItem(product);
  };
  </script>
  