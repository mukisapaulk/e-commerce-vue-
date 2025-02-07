import { defineStore } from "pinia";
import { db, collection, auth, addDoc, doc, updateDoc, getDocs, query, where } from "../../Firebase/index";

export const useOrderStore = defineStore("orderStore", {
  state: () => ({
    orders: [] as any[], // Stores fetched orders
  }),

  actions: {
    // Submit a new order
    async submitOrder(order: any) {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const ordersCollection = collection(db, "orders");
        await addDoc(ordersCollection, {
          ...order,
          userId: user.uid, // Associate order with user
          status: "Pending", // Default order status
          createdAt: new Date(),
        });
      } catch (error) {
        console.error("Error placing order:", error);
      }
    },

    // Fetch user's orders
    async fetchOrders() {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const ordersCollection = collection(db, "orders");
        const q = query(ordersCollection, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        this.orders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },

    // Update order status (Admin Only)
    async updateOrderStatus(orderId: string, newStatus: string) {
      try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status: newStatus });
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    },
  },
});
