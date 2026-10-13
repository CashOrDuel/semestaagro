// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDIRNWzxYWE0S8nfNZEp8xPZ2KK6avVbQo",
  authDomain: "cv-semesta-sinergy.firebaseapp.com",
  projectId: "cv-semesta-sinergy",
  storageBucket: "cv-semesta-sinergy.firebasestorage.app",
  messagingSenderId: "21507497165",
  appId: "1:21507497165:web:63424a8cdf97043ae8dd84",
  measurementId: "G-5HNSCB3LCC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Ini yang dipakai untuk simpan/ambil data
export const auth = getAuth(app);