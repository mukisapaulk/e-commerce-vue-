// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, setDoc, deleteDoc, getDocs, addDoc, updateDoc, query, where } from 'firebase/firestore';
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5zFgaIM68W_A4MevH0fHk9hicoUiQvbU",
  authDomain: "e-commerce-aceef.firebaseapp.com",
  projectId: "e-commerce-aceef",
  storageBucket: "e-commerce-aceef.firebasestorage.app",
  messagingSenderId: "322883950407",
  appId: "1:322883950407:web:a77a33271fbe7edbaf1e62"
};

// Initialize Firebase
const googleProvider = new GoogleAuthProvider();
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, googleProvider, collection, getDocs, doc, setDoc, deleteDoc, getDoc, addDoc, where, query, updateDoc };