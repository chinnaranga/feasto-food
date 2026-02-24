import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore"; // Added static imports
import {
  auth,
  googleProvider,
  storage,
  db
} from "../config/firebase";
import toast from "react-hot-toast"; // <--- Added import
import { loadAIMemoryFromCloud } from "../ai/aiMemoryCloud";

const AuthContext = createContext(null);

/* -------------------------
   Auth Provider
-------------------------- */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authAction, setAuthAction] = useState(null); // 'login' | 'google' | etc.

  /* Listen for auth state changes */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          // 1. Fetch User Data
          // const { doc, getDoc, getFirestore } = await import("firebase/firestore");
          // const db = getFirestore();
          // Using static db from config and methods from top-level import
          const { db } = await import("../config/firebase"); // dynamic import of config is okay? No, let's use static.
          // Wait, db is already imported statically at line 14: import { auth, googleProvider, storage } from "../config/firebase";
          // I need to add db to that import.
          // 1. Fetch User Data
          const userDocRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          } else {
            setUserData(null);
          }

          // 2. Hydrate AI Memory
          // const { loadAIMemoryFromCloud } = await import("../ai/aiMemoryCloud"); // REMOVING DYNAMIC IMPORT
          const memory = await loadAIMemoryFromCloud(user.uid);
          if (memory) {
            localStorage.setItem("aerobite_ai_memory", JSON.stringify(memory));
          }
        } catch (e) {
          console.error("Auth hydration failed", e);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* -------- Helpers -------- */

  const normalizeError = (error) => {
    if (!error?.code) return "Something went wrong. Please try again.";
    const map = {
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password.",
      "auth/invalid-email": "Invalid email address.",
      "auth/popup-closed-by-user": "Sign-in popup was closed.",
      "auth/account-exists-with-different-credential": "Account exists with another sign-in method.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
    };
    return map[error.code] || error.message;
  };

  /* -------- Auth Methods -------- */

  const signup = async (email, password, displayName) => {
    setAuthAction("signup");
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      return result;
    } catch (err) {
      throw new Error(normalizeError(err));
    } finally {
      setAuthAction(null);
    }
  };

  const login = async (email, password) => {
    setAuthAction("login");
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      throw new Error(normalizeError(err));
    } finally {
      setAuthAction(null);
    }
  };

  const logout = async () => {
    setAuthAction("logout");
    await signOut(auth);
    setAuthAction(null);
  };



  const googleSignIn = async () => {
    setAuthAction("google");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Popup resolves immediately with the user
      if (result.user) {
        toast.success(`Welcome ${result.user.displayName}!`);
        // onAuthStateChanged will handle the rest
      }
    } catch (err) {
      console.error("Google Popup Error:", err);
      // Handle popup closed by user gracefully
      if (err.code !== 'auth/popup-closed-by-user') {
        throw new Error(normalizeError(err));
      }
    } finally {
      setAuthAction(null);
    }
  };

  /* Twitter and GitHub methods removed as per request */

  const updateUserProfile = async (data, avatarFile) => {
    if (!currentUser) throw new Error("No user logged in");
    setLoading(true);

    try {
      let photoURL = currentUser.photoURL;

      // 1. Upload Avatar if provided
      if (avatarFile) {
        // Use static imports (added to top of file)
        const storageRef = ref(storage, `avatars/${currentUser.uid}/${Date.now()}_${avatarFile.name}`);
        await uploadBytes(storageRef, avatarFile);
        photoURL = await getDownloadURL(storageRef);
      }

      // 2. Update Auth Profile
      if (data.displayName || photoURL !== currentUser.photoURL) {
        await updateProfile(currentUser, {
          displayName: data.displayName || currentUser.displayName,
          photoURL: photoURL
        });
      }

      // 3. Update Firestore User Doc
      // Use static db import from config
      // WAIT, the goal is to make EVERYTHING static to avoid the warning.
      // So I will start by adding the static imports at the top and removing them here.
      const userRef = doc(db, "users", currentUser.uid);

      const updateData = {
        ...data,
        photoURL,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(userRef, updateData);

      // 4. Update Local State
      setUserData(prev => ({ ...prev, ...updateData }));
      setCurrentUser({ ...currentUser, ...updateData }); // Force re-render

      return true;
    } catch (err) {
      console.error("Profile Update Failed:", err);
      throw new Error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* -------- Derived State -------- */

  const isAuthenticated = !!currentUser;

  const value = useMemo(
    () => ({
      currentUser,
      userData,
      isAuthenticated,
      loading,
      authAction,
      signup,
      login,
      logout,
      googleSignIn,
      isPremium: !!userData?.isPremium,
      upgradeToPremium: () => setUserData(prev => ({ ...prev, isPremium: true })),
      updateUserProfile,
    }),
    [currentUser, userData, loading, authAction]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* -------------------------
   Hook
-------------------------- */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
