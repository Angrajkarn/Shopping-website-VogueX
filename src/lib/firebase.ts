import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDdVKp4ia8W70IyXrHeqMiZ62NOe8SJtcc",
    authDomain: "voguexx-5f878.firebaseapp.com",
    projectId: "voguexx-5f878",
    storageBucket: "voguexx-5f878.firebasestorage.app",
    messagingSenderId: "915985650932",
    appId: "1:915985650932:web:ac1ca8b249107383b9faa1",
    measurementId: "G-RB7V7J76S5",
    // Fallback for DB URL (derived from project ID usually, but optional for Auth)
    databaseURL: "https://voguexx-5f878-default-rtdb.firebaseio.com"
};

// Initialize Firebase (singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
