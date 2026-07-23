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
import { collection, addDoc, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Writes a login_activity doc in the shape the admin panel's
// /admin/login-activity endpoint expects: uid for security-rule ownership,
// user_id/user_name/user_email/phone_number/login_at for the admin table.
async function logUserActivity(uid, userName, userEmail, phoneNumber) {
  if (!uid) return;

  try {
    await addDoc(collection(db, "login_activity"), {
      uid,                 // used by Firestore security rules for ownership
      user_id: uid,        // used by admin panel queries
      user_name: userName || "",
      user_email: userEmail || "",
      phone_number: phoneNumber || "",
      login_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to save login activity:", error);
  }
}

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

    // Profile doc carries BOTH the site's existing field names (fullName,
    // mobile, createdAt) and the admin panel's expected field names
    // (id, name, phone, role, status, created_at, last_login_at). Extra
    // fields are harmless in Firestore, so nothing else needs to change.
    // NOTE: created_at/last_login_at are plain ISO strings, not Firestore
    // serverTimestamp() objects — the admin panel's frontend calls
    // .slice() on these to format dates, which only works on strings.
    const nowIso = new Date().toISOString();
    const profile = {
      uid: result.user.uid,
      fullName,
      email,
      mobile,
      createdAt: nowIso,

      id: result.user.uid,
      name: fullName,
      phone: mobile,
      role: "user",
      status: "active",
      created_at: nowIso,
      last_login_at: null,
    };

    setUserProfile(profile);
    setDoc(doc(db, "users", result.user.uid), profile).catch(error => {
      console.error("Failed to save user profile:", error);
    });
    await logUserActivity(result.user.uid, fullName, email, mobile);
    return result;
  }

  async function login(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);

    let profile = null;
    try {
      const snap = await getDoc(doc(db, "users", result.user.uid));
      if (snap.exists()) {
        profile = snap.data();
        setUserProfile(profile);
      }
    } catch {
      /* profile fetch non-critical */
    }

    // Bump last_login_at for the admin panel's user list.
    // Plain ISO string — see note in register() about why not serverTimestamp().
    updateDoc(doc(db, "users", result.user.uid), {
      last_login_at: new Date().toISOString(),
    }).catch(() => {
      /* non-critical */
    });

    await logUserActivity(
      result.user.uid,
      profile?.fullName || profile?.name || result.user.displayName || "",
      email,
      profile?.mobile || profile?.phone || ""
    );
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