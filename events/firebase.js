import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCkrCu7nPR57WP6P6RlaXbi4UTGTcAXLu0",
  authDomain: "nase-dulezite-dny.firebaseapp.com",
  projectId: "nase-dulezite-dny",
  storageBucket: "nase-dulezite-dny.firebasestorage.app",
  messagingSenderId: "570170161132",
  appId: "1:570170161132:web:a57344df835cf6d9c232c9"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Init EmailJS
emailjs.init("4Zg70540JSSTos5FO");

export { db };
