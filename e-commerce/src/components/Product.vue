<template>
    <div>
      <h2>{{ product.name }}</h2>
      <p>{{ product.price }}</p>
      <button @click="addToCart">Add to Cart</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useCartStore } from "@/stores/cartStore";
  
  const cartStore = useCartStore();
  
  const product = {
    id: "product1",
    name: "Product 1",
    price: 20,
    quantity: 1, // You can adjust this quantity based on user input
  };
  
  const addToCart = () => {
    cartStore.addItem(product);
  };
  </script>
  