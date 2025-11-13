// firebase-init.js
// Firebase initialization using ESM imports from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6ZFOhBH5KanGpNpqZ96SGjvybnDeO3ac",
  authDomain: "anton-871fe.firebaseapp.com",
  projectId: "anton-871fe",
  storageBucket: "anton-871fe.firebasestorage.app",
  messagingSenderId: "211150176132",
  appId: "1:211150176132:web:cfb3826f503f7c579a67d1",
  measurementId: "G-12E3XL9TM5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
try {
  analytics = getAnalytics(app);
  console.log('Firebase initialized successfully');
} catch (e) {
  console.warn('Firebase analytics not initialized:', e);
}

export { app, analytics };
