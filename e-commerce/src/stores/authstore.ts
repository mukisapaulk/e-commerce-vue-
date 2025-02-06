// src/stores/authStore.ts
import { defineStore } from "pinia";
import { auth, db, googleProvider, doc, setDoc, getDoc } from "../../Firebase/index";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

interface AuthState {
  user: User | null;
  role: string | null; // 'admin' or 'customer'
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("authStore", {
  state: (): AuthState => ({
    user: null,
    role: null,
    loading: false,
    error: null,
  }),

  actions: {
    // Store user role in Firestore
    async setUserRole(uid: string, role: string): Promise<void> {
      try {
        await setDoc(doc(db, "users", uid), { role }, { merge: true });
      } catch (error: unknown) {
        console.error("Error setting user role:", error);
      }
    },

    // Get user role from Firestore
    async fetchUserRole(uid: string): Promise<void> {
      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          this.role = userDoc.data().role;
        }
      } catch (error: unknown) {
        console.error("Error fetching user role:", error);
      }
    },

    // Sign Up with Email & Store Role
    async signUp(email: string, password: string, role: string): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        this.user = userCredential.user;
        await this.setUserRole(this.user.uid, role);
        this.role = role;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        }
      } finally {
        this.loading = false;
      }
    },

    // Login with Email & Fetch Role
    async login(email: string, password: string): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        this.user = userCredential.user;
        await this.fetchUserRole(this.user.uid);
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        }
      } finally {
        this.loading = false;
      }
    },

    // Google Login & Store Role if First Time
    async googleLogin(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const result = await signInWithPopup(auth, googleProvider);
        this.user = result.user;

        // Check if role exists in Firestore; if not, set default role
        const userDoc = await getDoc(doc(db, "users", this.user.uid));
        if (!userDoc.exists()) {
          await this.setUserRole(this.user.uid, "customer");
        }

        await this.fetchUserRole(this.user.uid);
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        }
      } finally {
        this.loading = false;
      }
    },

    // Logout
    async logout(): Promise<void> {
      try {
        await signOut(auth);
        this.user = null;
        this.role = null;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message;
        }
      }
    },

    // Initialize Authentication & Load Role
    initAuth(): void {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.user = user;
          await this.fetchUserRole(user.uid);
        } else {
          this.user = null;
          this.role = null;
        }
      });
    },
  },
});