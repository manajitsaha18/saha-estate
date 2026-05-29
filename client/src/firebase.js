// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-ab389.firebaseapp.com",
  projectId: "mern-estate-ab389",
  storageBucket: "mern-estate-ab389.firebasestorage.app",
  messagingSenderId: "1044313124440",
  appId: "1:1044313124440:web:efcadcf40028dbc024242d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);