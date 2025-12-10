/**
 * Firebase Configuration
 * ----------------------
 * PROJECT ID: jordan-7d673
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, writeBatch } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyA5v_dVIZnC-LFdmZbukGaSfh1xuDYBdks",
    authDomain: "jordan-7d673.firebaseapp.com",
    projectId: "jordan-7d673",
    storageBucket: "jordan-7d673.firebasestorage.app",
    messagingSenderId: "1059709954926",
    appId: "1:1059709954926:web:fd72661056050ba9a82f7f",
    measurementId: "G-P33SQ3WPED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export {
    app,
    db,
    auth,
    storage,
    googleProvider,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    writeBatch,
    signInWithPopup,
    onAuthStateChanged,
    signOut,
    ref,
    uploadBytes,
    getDownloadURL
};
