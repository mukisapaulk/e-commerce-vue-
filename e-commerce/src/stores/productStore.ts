import { defineStore } from 'pinia'
import { db, collection, getDocs, doc, setDoc, deleteDoc } from '../../Firebase/index'

interface Product {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  category: string
  stock: number
}

export const useProductStore = defineStore('productStore', {
  state: () => ({
    products: [] as Product[],
  }),

  actions: {
    // Fetch all products from Firestore and retrieve images from localStorage
    async fetchProducts() {
      const querySnapshot = await getDocs(collection(db, 'products'))
      this.products = querySnapshot.docs.map((doc) => {
        const productData = doc.data() as Product

        // Retrieve image from localStorage
        const storedImage = localStorage.getItem(`product-image-${productData.id}`)
        if (storedImage) {
          productData.imageUrl = storedImage
        }

        return { id: doc.id, ...productData }
      })
    },

    // Convert image file to Base64 and store in localStorage
    async uploadImageToLocalStorage(file: File, productId: string): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          const base64Image = reader.result as string

          // Store image in localStorage
          localStorage.setItem(`product-image-${productId}`, base64Image)
          resolve(base64Image)
        }
        reader.onerror = (error) => reject(error)
      })
    },

    // Add a new product and store image locally
    async addProduct(product: Product, file?: File) {
      if (file) {
        product.imageUrl = await this.uploadImageToLocalStorage(file, product.id)
      }

      const productRef = doc(db, 'products', product.id)
      await setDoc(productRef, product)
      await this.fetchProducts()
    },

    // Delete a product and remove its image from localStorage
    async deleteProduct(productId: string) {
      await deleteDoc(doc(db, 'products', productId))

      // Remove image from localStorage
      localStorage.removeItem(`product-image-${productId}`)

      await this.fetchProducts()
    },
  },
})
