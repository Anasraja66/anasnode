import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCB5nsrMxrR_l2uUPgpdhSy_4LvGC2QhIQ",
  authDomain: "anaos12.firebaseapp.com",
  projectId: "anaos12",
  storageBucket: "anaos12.firebasestorage.app",
  messagingSenderId: "74617598630",
  appId: "1:74617598630:web:0df7bb7e31bfbf26d4fa67",
  measurementId: "G-YYW6R00Q01"
};

// Initialize Firebase securely for Next.js (prevent re-initialization in dev)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
