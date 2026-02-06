// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// The firebaseConfig object is now defined in js/env.js
// which is loaded before this script in the HTML.

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
