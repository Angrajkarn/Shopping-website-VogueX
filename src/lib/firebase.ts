import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBr98MqUrXkVFBW5aazs4dnq9eVX7aaNL0",
    authDomain: "voguex-370fe.firebaseapp.com",
    databaseURL: "https://voguex-370fe-default-rtdb.firebaseio.com",
    projectId: "voguex-370fe",
    storageBucket: "voguex-370fe.firebasestorage.app",
    messagingSenderId: "446304275788",
    appId: "1:446304275788:web:f8e8c6fa010342842f93e9",
    measurementId: "G-2CV8MPQEDR"
};

// Initialize Firebase (singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
