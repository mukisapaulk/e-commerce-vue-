import { defineStore } from 'pinia'
import { doc, getDoc, setDoc, db, auth } from '../../Firebase/index'
import { onAuthStateChanged } from 'firebase/auth'

// Define Product Interface
interface Product {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  category: string
  stock: number
}

// Define CartItem Interface
interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
  stock: number
}

export const useCartStore = defineStore('cartStore', {
  state: () => ({
    items: [] as CartItem[],
    discount: 10, // Default discount percentage
    taxRate: 0.08, // 8% Tax
    userId: null as string | null, // Track authenticated user
  }),

  getters: {
    itemCount(state): number {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },
    subtotal(state): number {
      return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    discountAmount(state): number {
      return (state.subtotal * state.discount) / 100
    },
    taxAmount(state): number {
      return (state.subtotal - state.discountAmount) * state.taxRate
    },
    totalPrice(state): number {
      return state.subtotal - state.discountAmount + state.taxAmount
    },
  },

  actions: {
    // Initialize cart based on authentication state
    async initCart() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.userId = user.uid
          await this.loadCartFromFirebase()
        } else {
          this.userId = null
          this.loadCartFromLocalStorage()
        }
      })
    },

    // Load cart from Local Storage (for guest users)
    loadCartFromLocalStorage() {
      const cartData = localStorage.getItem('cart')
      if (cartData) {
        const parsedData = JSON.parse(cartData)
        this.items = parsedData.items || []
        this.discount = parsedData.discount || 10
        this.taxRate = parsedData.taxRate || 0.08
      }
    },

    // Save cart to Local Storage (for guest users)
    saveCartToLocalStorage() {
      const cartData = {
        items: this.items,
        discount: this.discount,
        taxRate: this.taxRate,
      }
      localStorage.setItem('cart', JSON.stringify(cartData))
    },

    // Load cart from Firebase Firestore (for authenticated users)
    async loadCartFromFirebase() {
      if (!this.userId) return
      const cartRef = doc(db, 'carts', this.userId)
      const cartDoc = await getDoc(cartRef)

      if (cartDoc.exists()) {
        const data = cartDoc.data()
        this.items = data.items || []
        this.discount = data.discount || 10
        this.taxRate = data.taxRate || 0.08
      }
    },

    // Save cart to Firebase Firestore (for authenticated users)
    async saveCartToFirebase() {
      if (!this.userId) {
        this.saveCartToLocalStorage()
        return
      }
      const cartRef = doc(db, 'carts', this.userId)
      await setDoc(cartRef, {
        items: this.items,
        discount: this.discount,
        taxRate: this.taxRate,
      })
    },

    // Add item to cart
    addItem(product: Product, quantity: number = 1) {
      if (quantity <= 0) return // Prevent adding negative quantities

      const existingItem = this.items.find((item) => item.id === product.id)

      if (existingItem) {
        if (existingItem.quantity + quantity > product.stock) {
          alert('Not enough stock available!')
          return
        }
        existingItem.quantity += quantity
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: quantity,
          stock: product.stock,
        })
      }

      this.saveCartToFirebase()
    },

    // Remove item from cart
    removeItem(itemId: string) {
      this.items = this.items.filter((item) => item.id !== itemId)
      this.saveCartToFirebase()
    },

    // Update item quantity in cart
    updateItemQuantity(itemId: string, quantity: number) {
      const item = this.items.find((item) => item.id === itemId)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(itemId)
        } else if (quantity > item.stock) {
          alert('Not enough stock available!')
        } else {
          item.quantity = quantity
        }
      }
      this.saveCartToFirebase()
    },

    // Clear cart
    clearCart() {
      this.items = []
      this.saveCartToFirebase()
    },

    // Set discount dynamically
    setDiscount(discount: number) {
      this.discount = discount
      this.saveCartToFirebase()
    },

    // Set tax rate dynamically
    setTaxRate(taxRate: number) {
      this.taxRate = taxRate
      this.saveCartToFirebase()
    },
  },
})
