import { defineStore } from "pinia";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../Firebase/index";
import { onAuthStateChanged } from "firebase/auth";

// Define types for user profile
interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface PaymentMethod {
  type: string; // e.g., "Credit Card", "PayPal"
  last4: string;
  expiry: string;
}

interface Preferences {
  theme?: string;
  notifications?: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  preferences: Preferences;
}

export const useUserStore = defineStore("userStore", {
  state: () => ({
    userId: null as string | null,
    userProfile: {
      name: "",
      email: "",
      phone: "",
      addresses: [] as Address[],
      paymentMethods: [] as PaymentMethod[],
      preferences: {} as Preferences,
    },
  }),

  actions: {
    // Initialize user store and fetch user data
    async initUser() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.userId = user.uid;
          await this.loadUserProfile();
        } else {
          this.userId = null;
          this.resetUserProfile();
        }
      });
    },

    // Load user profile from Firestore
    async loadUserProfile() {
      if (!this.userId) return;
      const userRef = doc(db, "users", this.userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        this.userProfile = userDoc.data() as UserProfile;
      }
    },

    // Save user profile to Firestore
    async saveUserProfile() {
      if (!this.userId) return;
      const userRef = doc(db, "users", this.userId);
      await setDoc(userRef, this.userProfile, { merge: true });
    },

    // Update user field dynamically
    updateUserField<K extends keyof UserProfile>(field: K, value: UserProfile[K]) {
      this.userProfile[field] = value;
      this.saveUserProfile();
    },

    // Add address
    addAddress(address: Address) {
      this.userProfile.addresses.push(address);
      this.saveUserProfile();
    },

    // Remove address by index
    removeAddress(index: number) {
      this.userProfile.addresses.splice(index, 1);
      this.saveUserProfile();
    },

    // Add payment method
    addPaymentMethod(paymentMethod: PaymentMethod) {
      this.userProfile.paymentMethods.push(paymentMethod);
      this.saveUserProfile();
    },

    // Remove payment method by index
    removePaymentMethod(index: number) {
      this.userProfile.paymentMethods.splice(index, 1);
      this.saveUserProfile();
    },

    // Update user preferences
    updatePreferences(preferences: Partial<Preferences>) {
      this.userProfile.preferences = { ...this.userProfile.preferences, ...preferences };
      this.saveUserProfile();
    },

    // Reset user profile on logout
    resetUserProfile() {
      this.userProfile = {
        name: "",
        email: "",
        phone: "",
        addresses: [],
        paymentMethods: [],
        preferences: {},
      };
    },
  },
});
