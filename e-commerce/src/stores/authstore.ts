import { defineStore } from 'pinia'
import { auth, db, googleProvider, doc, setDoc, getDoc, updateDoc } from '../../Firebase/index'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'

interface AuthState {
  user: User | null
  username: string | null
  role: string | null // 'admin' or 'customer'
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('authStore', {
  state: (): AuthState => ({
    user: null,
    username: null,
    role: null,
    loading: false,
    error: null,
  }),

  actions: {
    // Store user role and username in Firestore
    async setUserProfile(uid: string, username: string, role: string): Promise<void> {
      try {
        await setDoc(doc(db, 'users', uid), { username, role }, { merge: true })
      } catch (error: unknown) {
        console.error('Error setting user profile:', error)
      }
    },

    // Fetch user profile (username & role)
    async fetchUserProfile(uid: string): Promise<void> {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          this.username = userData.username
          this.role = userData.role
        }
      } catch (error: unknown) {
        console.error('Error fetching user profile:', error)
      }
    },

    // Update user role (Admin Action)
    async updateUserRole(uid: string, newRole: string): Promise<void> {
      if (!this.user || this.role !== 'admin') {
        this.error = 'Unauthorized: Only admins can update roles.'
        return
      }

      try {
        const userRef = doc(db, 'users', uid)
        await updateDoc(userRef, { role: newRole })

        // If updating own role, update locally too
        if (this.user.uid === uid) {
          this.role = newRole
        }

        alert('User role updated successfully!')
      } catch (error: unknown) {
        console.error('Error updating user role:', error)
      }
    },

    // Sign Up with Email, Username & Store Role
    async signUp(
      email: string,
      password: string,
      username: string,
      role: string = 'customer',
    ): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        await this.setUserProfile(this.user.uid, username, role)
        this.username = username
        this.role = role
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message
        }
      } finally {
        this.loading = false
      }
    },

    // Login with Email & Fetch Profile
    async login(email: string, password: string): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        await this.fetchUserProfile(this.user.uid)
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message
        }
      } finally {
        this.loading = false
      }
    },

    // Google Login & Store Profile if First Time
    async googleLogin(): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const result = await signInWithPopup(auth, googleProvider)
        this.user = result.user

        // Check if username & role exist in Firestore; if not, set defaults
        const userDoc = await getDoc(doc(db, 'users', this.user.uid))
        if (!userDoc.exists()) {
          await this.setUserProfile(this.user.uid, this.user.displayName || 'New User', 'customer')
        }

        await this.fetchUserProfile(this.user.uid)
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message
        }
      } finally {
        this.loading = false
      }
    },

    // Logout
    async logout(): Promise<void> {
      try {
        await signOut(auth)
        this.user = null
        this.username = null
        this.role = null
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message
        }
      }
    },

    // Initialize Authentication & Load Profile
    initAuth(): void {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.user = user
          await this.fetchUserProfile(user.uid)
        } else {
          this.user = null
          this.username = null
          this.role = null
        }
      })
    },
  },
})
