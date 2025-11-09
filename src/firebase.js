import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZxRJ6t2AQpiR8dquwo3qweFr0HAwiukg",
  authDomain: "sunbridge-5a90a.firebaseapp.com",
  projectId: "sunbridge-5a90a",
  storageBucket: "sunbridge-5a90a.firebasestorage.app",
  messagingSenderId: "1070260666219",
  appId: "1:1070260666219:web:449c14d92b99d25c25562e",
  measurementId: "G-BND6S1W80R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);