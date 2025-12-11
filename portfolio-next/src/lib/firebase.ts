import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Next.js, it's best to use environment variables, but for this static export demo, 
// we'll inline the public config (it's visible in client bundle anyway).
const firebaseConfig = {
    apiKey: "AIzaSyA5v_dVIZnC-LFdmZbukGaSfh1xuDYBdks",
    authDomain: "jordan-7d673.firebaseapp.com",
    projectId: "jordan-7d673",
    storageBucket: "jordan-7d673.firebasestorage.app",
    messagingSenderId: "1059709954926",
    appId: "1:1059709954926:web:fd72661056050ba9a82f7f",
    measurementId: "G-P33SQ3WPED"
};

// Initialize Firebase (Singleton pattern)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
