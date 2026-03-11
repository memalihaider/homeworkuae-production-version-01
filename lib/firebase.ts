// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDU9KZ3r-HtwjcQOxwCFSveprrBk1Mf8lA",
  authDomain: "homework-a36e3.firebaseapp.com",
  projectId: "homework-a36e3",
  storageBucket: "homework-a36e3.firebasestorage.app",
  messagingSenderId: "476483591829",
  appId: "1:476483591829:web:336c9ccbb7e23d0049459a"
};

// ✅ SINGLETON PATTERN: Sirf ek hi baar initialize karein
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

