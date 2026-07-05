import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      setLoading(false);
      getDoc(doc(db, "users", u.uid))
        .then((snap) => {
          if (snap.exists()) setUserProfile(snap.data());
          else setUserProfile(null);
        })
        .catch(() => setUserProfile(null));
    });
    return unsubscribe;
  }, []);

  async function register(fullName, email, mobile, password) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: fullName });
    const profile = {
      uid: result.user.uid,
      fullName,
      email,
      mobile,
      createdAt: serverTimestamp()
    };
    setUserProfile(profile);
    setDoc(doc(db, "users", result.user.uid), profile).catch(error => {
      console.error("Failed to save user profile:", error);
    });
    return result;
  }

  async function login(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    getDoc(doc(db, "users", result.user.uid))
      .then((snap) => {
        if (snap.exists()) setUserProfile(snap.data());
      })
      .catch(() => {
        /* profile fetch non-critical */
      });
    return result;
  }

  async function logout() {
    await signOut(auth);
    setUserProfile(null);
  }

  async function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, userProfile, register, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}
