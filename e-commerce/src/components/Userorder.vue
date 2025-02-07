<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">My Orders</h1>

    <div v-if="orderStore.orders.length === 0" class="text-gray-500">
      <p>You have no past orders.</p>
    </div>

    <div v-else>
      <div
        v-for="order in orderStore.orders"
        :key="order.id"
        class="border p-4 rounded shadow mb-4"
      >
        <h2 class="text-xl font-semibold">Order #{{ order.id }}</h2>
        <p class="text-gray-600">
          Status: <span class="font-bold">{{ order.status }}</span>
        </p>
        <p class="text-gray-600">Total: ${{ order.total.toFixed(2) }}</p>

        <ul class="mt-2">
          <li v-for="item in order.items" :key="item.id" class="border-b py-2">
            <div class="flex justify-between">
              <span>{{ item.name }} (x{{ item.quantity }})</span>
              <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useOrderStore } from '@/stores/orderStore'

const orderStore = useOrderStore()

onMounted(() => {
  orderStore.fetchOrders()
})
</script>
