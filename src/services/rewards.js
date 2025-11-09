import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";

export async function getAllRewards() {
  const snapshot = await getDocs(collection(db, "rewards"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addReward(reward) {
  // Remove id field if it exists (Firestore auto-generates IDs)
  const { id, ...rewardData } = reward;
  const finalData = {
    ...rewardData,
    isActive: true,
    createdAt: serverTimestamp()
  };
  const docRef = await addDoc(collection(db, "rewards"), finalData);
  return docRef.id;
}

export async function updateReward(id, reward) {
  await updateDoc(doc(db, "rewards", id), {
    ...reward,
    updatedAt: serverTimestamp()
  });
}

export async function deleteReward(id) {
  await deleteDoc(doc(db, "rewards", id));
}