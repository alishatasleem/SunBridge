import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc,
  query,
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";
import { getUserById, updateUser } from "./users";

export async function getAllTransactions() {
  const q = query(collection(db, "ledger"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function createEnergyTransaction(fromUid, toUid, amount) {
  const fromUser = await getUserById(fromUid);
  const toUser = await getUserById(toUid);

  // Validate the amount
  if (amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  if (amount > (fromUser.houseData?.surplus || 0)) {
    throw new Error(`Cannot share more than your surplus (${fromUser.houseData?.surplus || 0} kWh)`);
  }

  // NEW: Check if recipient actually needs this much
  const recipientDeficit = toUser.houseData?.deficit || 0;
  if (recipientDeficit === 0) {
    throw new Error(`${toUser.name} doesn't need any energy right now`);
  }
  
  if (amount > recipientDeficit) {
    throw new Error(`${toUser.name} only needs ${recipientDeficit} kWh. Please enter a lower amount.`);
  }

  const transaction = {
    fromId: fromUid,
    toId: toUid,
    from: fromUser.houseId,
    to: toUser.houseId,
    amount: parseFloat(amount),
    timestamp: new Date().toLocaleString(),
    approved: false,
    status: "Pending Approval",
    createdAt: serverTimestamp()
  };

  await addDoc(collection(db, "ledger"), transaction);

  // Calculate points: 10 points per kWh
  const pointsEarned = Math.round(amount * 10);

  const newFromProduction = fromUser.houseData.production - amount;
  await updateUser(fromUid, {
    points: (fromUser.points || 0) + pointsEarned,
    houseData: {
      ...fromUser.houseData,
      production: parseFloat(newFromProduction.toFixed(1)),
      surplus: Math.max(0, parseFloat((newFromProduction - fromUser.houseData.consumption).toFixed(1))),
      deficit: Math.max(0, parseFloat((fromUser.houseData.consumption - newFromProduction).toFixed(1)))
    }
  });

  const newToConsumption = Math.max(0, toUser.houseData.consumption - amount);
  await updateUser(toUid, {
    houseData: {
      ...toUser.houseData,
      consumption: parseFloat(newToConsumption.toFixed(1)),
      surplus: Math.max(0, parseFloat((toUser.houseData.production - newToConsumption).toFixed(1))),
      deficit: Math.max(0, parseFloat((newToConsumption - toUser.houseData.production).toFixed(1)))
    }
  });

  return pointsEarned;
}

export async function approveTransaction(txId) {
  await updateDoc(doc(db, "ledger", txId), {
    approved: true,
    status: "Approved",
    approvedAt: serverTimestamp()
  });
}