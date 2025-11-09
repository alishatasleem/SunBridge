import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function getAllUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getUserById(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) throw new Error("User not found");
  return { id: uid, ...userDoc.data() };
}

export async function updateUser(uid, data) {
  await updateDoc(doc(db, "users", uid), data);
}

export async function updatePastData(uid, pastProduction, pastUsage) {
  await updateDoc(doc(db, "users", uid), {
    pastProduction: pastProduction.map(Number),
    pastUsage: pastUsage.map(Number)
  });
}

export async function updatePoints(uid, points) {
  await updateDoc(doc(db, "users", uid), { points });
}

export async function addCouponToUser(uid, coupon) {
  const userDoc = await getDoc(doc(db, "users", uid));
  const userData = userDoc.data();
  const coupons = userData.coupons || [];
  await updateDoc(doc(db, "users", uid), {
    coupons: [...coupons, coupon]
  });
}