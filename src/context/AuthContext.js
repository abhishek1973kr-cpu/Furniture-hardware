"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

const defaultAuthContext = {
  user: null,
  loading: false,
  authError: "",
  setAuthError: () => {},
  login: async () => ({ success: false }),
  logout: async () => {},
  isAuthenticated: false,
  isFirebaseConfigured: false,
};

const AuthContext = createContext(defaultAuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [authError, setAuthError] = useState("");

  // Listen strictly to Firebase auth state changes
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      setLoading(true);
      try {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Admin",
              role: "Authorized Firebase Admin",
              isFirebase: true,
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        });
        return () => unsubscribe();
      } catch (err) {
        console.error("Firebase auth listener error:", err);
        setLoading(false);
      }
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  // Strict Login Method: ONLY Firebase Authentication Allowed
  const login = async (email, password) => {
    setAuthError("");

    // If Firebase credentials are not yet configured in .env.local
    if (!isFirebaseConfigured || !auth) {
      const msg =
        "Firebase is not connected. Please add your real Firebase API credentials to .env.local to authenticate with Firebase.";
      setAuthError(msg);
      return { success: false, error: msg };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const fbUser = userCredential.user;
      const verifiedUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || fbUser.email?.split("@")[0] || "Admin",
        role: "Authorized Firebase Admin",
        isFirebase: true,
      };
      setUser(verifiedUser);
      return { success: true, user: verifiedUser };
    } catch (error) {
      let errorMsg = "Authentication failed. Only registered Firebase users can log in.";
      
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        errorMsg = "Invalid email or password in Firebase.";
      } else if (error.code === "auth/user-not-found") {
        errorMsg = "No user found with this email in Firebase Auth.";
      } else if (error.code === "auth/invalid-email") {
        errorMsg = "Please enter a valid email format.";
      } else if (error.code === "auth/too-many-requests") {
        errorMsg = "Access temporarily blocked due to too many failed attempts. Try again later.";
      } else if (error.message) {
        errorMsg = error.message;
      }

      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Strict Logout Method
  const logout = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.error("Firebase signOut error:", err);
      }
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        setAuthError,
        login,
        logout,
        isAuthenticated: Boolean(user),
        isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context || defaultAuthContext;
}
