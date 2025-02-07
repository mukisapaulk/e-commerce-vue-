<template>
    <div class="container mx-auto p-6">
      <div v-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Product Image -->
        <img :src="product.imageUrl" alt="Product Image" class="w-full h-96 object-cover rounded-lg" />
  
        <!-- Product Details -->
        <div>
          <h2 class="text-3xl font-bold">{{ product.name }}</h2>
          <p class="text-gray-600 mt-2">Category: {{ product.category }}</p>
          <p class="text-gray-600 mt-2">Stock: {{ product.stock }}</p>
          <p class="text-xl font-semibold text-green-600 mt-2">${{ product.price }}</p>
          <p class="mt-4">{{ product.description }}</p>
  
          <!-- Add to Cart Button -->
          <button @click="addToCart" class="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-800">
            Add to Cart
          </button>
        </div>
      </div>
  
      <!-- Loading Message -->
      <div v-else class="text-center text-gray-500">
        <p>Loading product...</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { useProductStore } from "@/stores/productStore";
  import { useCartStore } from "@/stores/cartStore";
  
  const route = useRoute();
  const productStore = useProductStore();
  const cartStore = useCartStore();
  const product = ref(null);
  const quantity = ref(1);
  
  onMounted(async () => {
    await productStore.fetchProducts();
    product.value = productStore.products.find(p => p.id === route.params.id);
  });
  
  const addToCart = () => {
    if (product.value) {
      cartStore.addItem({ 
        id: product.value.id, 
        name: product.value.name, 
        price: product.value.price, 
        quantity: quantity.value, 
        imageUrl: product.value.imageUrl, 
        stock: product.value.stock 
      });
    }
  };
  </script>
  