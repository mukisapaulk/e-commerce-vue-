<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Page Title -->
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Admin Product Management</h1>

      <!-- Product Form -->
      <div class="bg-white p-6 border border-gray-200 rounded-lg shadow-sm mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">
          {{ isEditing ? 'Edit Product' : 'Add Product' }}
        </h2>

        <form @submit.prevent="saveProduct" class="space-y-6">
          <!-- Product Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input
              v-model="newProduct.name"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Enter product name"
            />
          </div>

          <!-- Product Price -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input
              v-model="newProduct.price"
              type="number"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Enter price"
            />
          </div>

          <!-- Product Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="newProduct.description"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Enter product description"
              rows="4"
            ></textarea>
          </div>

          <!-- Product Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              v-model="newProduct.category"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            >
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <!-- Product Stock -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Stock</label>
            <input
              v-model="newProduct.stock"
              type="number"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Enter stock quantity"
            />
          </div>

          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <input
              type="file"
              @change="handleFileChange"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
            <!-- Image Preview -->
            <div v-if="selectedFile" class="mt-4">
              <img
                :src="imagePreviewUrl"
                alt="Image preview"
                class="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex gap-4 mt-6">
            <button
              type="submit"
              class="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              {{ isEditing ? 'Update Product' : 'Add Product' }}
            </button>
            <button
              type="button"
              @click="resetForm"
              class="flex-1 px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Product List -->
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Product List</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in productStore.products"
          :key="product.id"
          class="bg-white p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <!-- Product Image -->
          <img
            :src="product.imageUrl"
            alt="Product Image"
            class="w-full h-48 object-cover rounded-lg mb-4"
          />

          <!-- Product Details -->
          <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
          <p class="text-gray-600">Price: ${{ product.price }}</p>
          <p class="text-gray-600">Stock: {{ product.stock }}</p>
          <p class="text-sm text-gray-500 mt-2">{{ product.description }}</p>

          <!-- Action Buttons -->
          <div class="flex gap-3 mt-4">
            <button
              @click="editProduct(product)"
              class="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
            >
              Edit
            </button>
            <button
              @click="deleteProduct(product.id)"
              class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProductStore } from '@/stores/productStore'

const productStore = useProductStore()
const newProduct = ref({
  id: '',
  name: '',
  price: 0,
  description: '',
  imageUrl: '',
  category: '',
  stock: 0,
})
const isEditing = ref(false)
const selectedFile = ref<File | null>(null)

// List of available categories
const categories = [
  'Apparel & Accessories',
  'Electronics & Computers',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Toys & Hobbies',
  'Food & Beverages',
]

onMounted(() => {
  productStore.fetchProducts()
})

// Handle image selection and create preview URL
const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    selectedFile.value = file
  }
}

// Image preview URL (to show preview of the selected file)
const imagePreviewUrl = computed(() => {
  return selectedFile.value ? URL.createObjectURL(selectedFile.value) : ''
})

// Add or update product
const saveProduct = async () => {
  if (!newProduct.value.name || !newProduct.value.price) {
    alert('Product name and price are required!')
    return
  }

  if (isEditing.value) {
    await productStore.addProduct(newProduct.value, selectedFile.value)
  } else {
    newProduct.value.id = Date.now().toString()
    await productStore.addProduct(newProduct.value, selectedFile.value)
  }

  resetForm()
}

// Edit product
const editProduct = (product) => {
  newProduct.value = { ...product }
  isEditing.value = true
}

// Reset form
const resetForm = () => {
  newProduct.value = {
    id: '',
    name: '',
    price: 0,
    description: '',
    imageUrl: '',
    category: '',
    stock: 0,
  }
  isEditing.value = false
  selectedFile.value = null
}

// Delete product
const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    await productStore.deleteProduct(id)
  }
}
</script>
