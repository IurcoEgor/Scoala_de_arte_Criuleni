// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "REPLACE_FIREBASE_API_KEY",
  authDomain: "REPLACE_FIREBASE_AUTH_DOMAIN",
  projectId: "REPLACE_FIREBASE_PROJECT_ID",
  storageBucket: "REPLACE_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_FIREBASE_MESSAGING_SENDER_ID",
  appId: "REPLACE_FIREBASE_APP_ID",
  measurementId: "REPLACE_FIREBASE_MEASUREMENT_ID"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
