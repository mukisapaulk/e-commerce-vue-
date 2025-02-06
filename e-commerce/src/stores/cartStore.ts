import { defineStore } from 'pinia';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

export const useCartStore = defineStore('cartStore', {
  state: (): CartState => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  },
  getters: {
    totalPrice(state): number {
      return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    itemCount(state): number {
      return state.items.reduce((count, item) => count + item.quantity, 0);
    },
  },
  actions: {
    addItem(item: CartItem) {
      const existingItem = this.items.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        this.items.push(item);
      }
      this.saveCart();
    },
    removeItem(itemId: string) {
      this.items = this.items.filter(item => item.id !== itemId);
      this.saveCart();
    },
    updateItemQuantity(itemId: string, quantity: number) {
      const item = this.items.find(i => i.id === itemId);
      if (item && quantity > 0) {
        item.quantity = quantity;
      } else {
        this.removeItem(itemId);
      }
      this.saveCart();
    },
    clearCart() {
      this.items = [];
      this.saveCart();
    },
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
  },
});
