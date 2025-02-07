<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Admin Product Management</h1>

    <!-- Product Form -->
    <div class="bg-white p-4 rounded shadow mb-6">
      <h2 class="text-lg font-semibold mb-2">{{ isEditing ? 'Edit' : 'Add' }} Product</h2>

      <input v-model="newProduct.name" class="w-full p-2 mb-2 border" placeholder="Product Name" />
      <input
        v-model="newProduct.price"
        type="number"
        class="w-full p-2 mb-2 border"
        placeholder="Price"
      />
      <textarea
        v-model="newProduct.description"
        class="w-full p-2 mb-2 border"
        placeholder="Description"
      ></textarea>

      <!-- Category Dropdown -->
      <div>
        <label for="productCategory" class="block font-semibold mb-2">Category</label>
        <select v-model="newProduct.category" id="productCategory" class="w-full p-2 mb-2 border">
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <input
        v-model="newProduct.stock"
        type="number"
        class="w-full p-2 mb-2 border"
        placeholder="Stock"
      />

      <!-- File Input for Image Upload -->
      <div class="mb-4">
        <input type="file" @change="handleFileChange" class="w-full p-2 mb-2 border" />

        <!-- Image Preview -->
        <div v-if="selectedFile" class="mt-4">
          <img :src="imagePreviewUrl" alt="Image preview" class="w-32 h-32 object-cover" />
        </div>
      </div>

      <button @click="saveProduct" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        {{ isEditing ? 'Update' : 'Add' }} Product
      </button>
      <button @click="resetForm" class="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
    </div>

    <!-- Product List -->
    <h2 class="text-xl font-bold mb-4">Product List</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="product in productStore.products"
        :key="product.id"
        class="border p-4 rounded shadow"
      >
        <!-- Display product image -->
        <img :src="product.imageUrl" alt="Product Image" class="w-full h-40 object-cover mb-2" />
        <h3 class="text-lg font-semibold">{{ product.name }}</h3>
        <p class="text-gray-600">Price: ${{ product.price }}</p>
        <p class="text-gray-600">Stock: {{ product.stock }}</p>
        <p class="text-sm text-gray-500">{{ product.description }}</p>

        <div class="mt-2">
          <button
            @click="editProduct(product)"
            class="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
          >
            Edit
          </button>
          <button
            @click="deleteProduct(product.id)"
            class="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
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
  'Home & Garden',
  'Beauty & Personal Care',
  'Books, Movies & Music',
  'Sports & Outdoors',
  'Toys & Hobbies',
  'Food & Beverages',
  'Automotive',
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
