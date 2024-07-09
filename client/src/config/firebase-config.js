// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "rss-feed-37367.firebaseapp.com",
  projectId: "rss-feed-37367",
  storageBucket: "rss-feed-37367.appspot.com",
  messagingSenderId: "475605155488",
  appId: "1:475605155488:web:d56df18a7f9a6704f3d3c5",
  measurementId: "G-MT4JRFWQHP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider(app)