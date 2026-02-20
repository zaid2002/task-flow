
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBqvbKhgxfzHHfMC6exHthho-X0jfgSKu0",
    authDomain: "todo-app-antigravity-1.firebaseapp.com",
    projectId: "todo-app-antigravity-1",
    storageBucket: "todo-app-antigravity-1.firebasestorage.app",
    messagingSenderId: "481828328293",
    appId: "1:481828328293:web:d47f8d585456eced68878c"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
