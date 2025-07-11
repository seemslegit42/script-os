
import { initializeApp, getApps, getApp } from 'firebase/app';

// TODO: Replace with your web app's Firebase configuration
// IMPORTANT: DO NOT COMMIT THIS FILE WITH REAL CREDENTIALS.
// Use environment variables in a real application.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-auth-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "your-messaging-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "your-app-id",
};

// Initialize Firebase
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
