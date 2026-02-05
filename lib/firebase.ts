// lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDU9KZ3r-HtwjcQOxwCFSveprrBk1Mf8lA",
  authDomain: "homework-a36e3.firebaseapp.com",
  projectId: "homework-a36e3",
  storageBucket: "homework-a36e3.firebasestorage.app",
  messagingSenderId: "476483591829",
  appId: "1:476483591829:web:336c9ccbb7e23d0049459a",
  measurementId: "G-NTCTYB9HVY"
};

// Initialize Firebase only if no apps exist
let firebaseApp: FirebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
  console.log('Firebase App Initialized');
} else {
  firebaseApp = getApps()[0];
  console.log('Using existing Firebase App');
}

// Export Firebase services
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);

// Analytics ko conditionally initialize karein
let analytics;
if (typeof window !== "undefined") {
  // Check if we're in the browser
  analytics = getAnalytics(firebaseApp);
}
export { analytics, firebaseApp as app };