// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtYsFk965rL7AbXxHbQqNnKSutk5inGGk",
  authDomain: "pooja-booking-website.firebaseapp.com",
  projectId: "pooja-booking-website",
  storageBucket: "pooja-booking-website.firebasestorage.app",
  messagingSenderId: "759508582797",
  appId: "1:759508582797:web:5a427c0372752a12883dc4",
  measurementId: "G-LGBZ9FPNQH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);