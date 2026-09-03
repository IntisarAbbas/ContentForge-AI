import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "../firebase";

// Google Provider
const googleProvider = new GoogleAuthProvider();

/* =========================
   SIGN UP
========================= */

export async function signup(email, password, name = "") {
  try {
    const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Save user's name in Firebase profile
    if (name.trim()) {
      await updateProfile(result.user, {
        displayName: name.trim(),
      });
    }

    return result.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/* =========================
   LOGIN
========================= */

export async function login(email, password) {
  try {
    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return result.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/* =========================
   GOOGLE LOGIN
========================= */

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(
      auth,
      googleProvider
    );

    return result.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/* =========================
   LOGOUT
========================= */

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/* =========================
   CURRENT USER
========================= */

export function getCurrentUser() {
  return auth.currentUser;
}

/* =========================
   FIREBASE ERROR HANDLER
========================= */

function getAuthErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-credential":
      return "Invalid email or password.";

    case "auth/user-not-found":
      return "No account found with this email.";

    case "auth/wrong-password":
      return "Incorrect password.";

    case "auth/email-already-in-use":
      return "An account already exists with this email.";

    case "auth/weak-password":
      return "Password must be at least 6 characters.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/popup-closed-by-user":
      return "Google login was cancelled.";

    case "auth/popup-blocked":
      return "Popup was blocked by your browser.";

    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    default:
      return error?.message || "Authentication failed. Please try again.";
  }
}