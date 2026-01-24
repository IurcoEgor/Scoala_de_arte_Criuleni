// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkLId9RhXjPqL3tb6mX1ZC3BXhfeUkCk0",
  authDomain: "scoala-de-arte-criuleni.firebaseapp.com",
  projectId: "scoala-de-arte-criuleni",
  storageBucket: "scoala-de-arte-criuleni.firebasestorage.app",
  messagingSenderId: "55607629161",
  appId: "1:55607629161:web:b981b3f0d293fa251c19f8",
  measurementId: "G-243PZJ5L6Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);