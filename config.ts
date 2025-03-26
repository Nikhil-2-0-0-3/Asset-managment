// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAloA5hpKNome-gbSYewnuC6wST9cQz-jA",
  authDomain: "asset-managment-29aff.firebaseapp.com",
  databaseURL: "https://asset-managment-29aff-default-rtdb.firebaseio.com",
  projectId: "asset-managment-29aff",
  storageBucket: "asset-managment-29aff.firebasestorage.app",
  messagingSenderId: "562518625470",
  appId: "1:562518625470:web:7a2d4afcfc3e341e3fa2ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);

// Export the database reference
export { db };
export const auth = getAuth(app);