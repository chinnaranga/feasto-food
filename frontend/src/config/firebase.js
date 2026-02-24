// src/config/firebase.js

import { initializeApp } from "firebase/app";
import {
   getAuth,
   GoogleAuthProvider,
   RecaptchaVerifier,
   signInWithPhoneNumber,
} from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/* -------------------------
   Firebase Config
-------------------------- */
const firebaseConfig = {
   apiKey: "AIzaSyBvcmUBlpqK2QvVPuk-knI5ALQQf_MCoFI",
   authDomain: "food-platform-b022f.firebaseapp.com",
   projectId: "food-platform-b022f",
   storageBucket: "food-platform-b022f.appspot.com",
   messagingSenderId: "877744102586",
   appId: "1:877744102586:web:ff2a1200e6cc7baa9bb683",
   measurementId: "G-G8LVRKTW15",
};

/* -------------------------
   Initialize Firebase
-------------------------- */
const app = initializeApp(firebaseConfig);

/* -------------------------
   Services
-------------------------- */
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
   experimentalForceLongPolling: false,
});
export const storage = getStorage(app);

/* -------------------------
   Auth Providers (Singletons)
-------------------------- */
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");

// Phone auth exports
export { RecaptchaVerifier, signInWithPhoneNumber };

// Twitter and Github providers removed per request

/* -------------------------
   Optional: Language / Custom Params
-------------------------- */
// auth.useDeviceLanguage();
// googleProvider.setCustomParameters({ prompt: "select_account" });