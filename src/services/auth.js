import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";

function generateHouseId(pobox) {
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SB-${pobox}-${random}`;
}

// -----------------------------
// Register new resident
// -----------------------------
export async function registerResident(data) {
  const { email, password, name, address, pobox } = data;
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  const houseId = generateHouseId(pobox);

  await setDoc(doc(db, "users", uid), {
    name,
    email,
    address,
    pobox,
    houseId,
    role: "resident",
    points: 0,
    coupons: [],
    houseData: {
      production: 0,
      consumption: 0,
      surplus: 0,
      deficit: 0,
    },
    pastProduction: [],
    pastUsage: [],
    createdAt: serverTimestamp(),
  });

  return { uid, houseId };
}

// -----------------------------
// Login resident (email OR houseId)
// -----------------------------
export async function loginResident(emailOrHouseId, password) {
  let email = emailOrHouseId;

  // If it looks like a House ID, resolve to email via Firestore
  if (typeof emailOrHouseId === "string" && emailOrHouseId.startsWith("SB-")) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("houseId", "==", emailOrHouseId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error("House ID not found");
    }
    email = snapshot.docs[0].data().email;
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  const userDoc = await getDoc(doc(db, "users", uid));

  if (!userDoc.exists()) throw new Error("User data not found");
  const userData = userDoc.data();
  if (userData.role !== "resident") throw new Error("Not a resident account");

  return { uid, ...userData };
}

// -----------------------------
// Admin login (single shared credential)
// Ensures Firestore admin doc exists after sign-in
// -----------------------------
export async function loginAdmin(email, password) {
  const ADMIN_EMAIL = "admin@sunbridge.com";
  const ADMIN_PASSWORD = "admin123";

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    throw new Error("Invalid admin credentials");
  }

  try {
    // Attempt normal sign-in
    const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    const uid = userCredential.user.uid;

    // Ensure Firestore doc exists
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        email: ADMIN_EMAIL,
        name: "Administrator",
        role: "admin",
        createdAt: serverTimestamp(),
      });
      return { uid, email: ADMIN_EMAIL, name: "Administrator", role: "admin" };
    }
    // Return existing admin data
    return { uid, ...snap.data() };
  } catch (error) {
    // First-time setup: create auth user + Firestore doc
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/invalid-credential" ||
      error.code === "auth/invalid-login-credentials"
    ) {
      const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        email: ADMIN_EMAIL,
        name: "Administrator",
        role: "admin",
        createdAt: serverTimestamp(),
      });

      return { uid, email: ADMIN_EMAIL, name: "Administrator", role: "admin" };
    }
    throw error;
  }
}

// -----------------------------
// Sign out
// -----------------------------
export async function signOut() {
  await firebaseSignOut(auth);
}

// -----------------------------
// Get current user data from Firestore
// -----------------------------
export async function getCurrentUserData(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) throw new Error("User not found");
  return { id: uid, ...userDoc.data() };
}
