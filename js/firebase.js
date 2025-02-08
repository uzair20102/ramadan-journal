import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCoVX9WRmy83Rh5dRkpH3OAqMFEiB_LiAY",
    authDomain: "ramadan-journal-4b6b9.firebaseapp.com",
    projectId: "ramadan-journal-4b6b9",
    storageBucket: "ramadan-journal-4b6b9.firebasestorage.app",
    messagingSenderId: "932727132042",
    appId: "1:932727132042:web:ee5b8f50b6bcab7bd78273",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { doc, setDoc, getDoc, updateDoc, collection, getDocs };