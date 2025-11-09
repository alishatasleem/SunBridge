import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { getUserById, updatePoints, addCouponToUser } from "./users";

export async function redeemReward(uid, reward) {
  const user = await getUserById(uid);

  if ((user.points || 0) < reward.cost) {
    throw new Error("Not enough points");
  }

  const couponCode = `RG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(couponCode)}`;

  const redemption = {
    userId: uid,
    rewardId: reward.id,
    rewardSnapshot: {
      name: reward.name,
      icon: reward.icon,
      cost: reward.cost,
      desc: reward.desc
    },
    code: couponCode,
    qr: qrUrl,
    status: "Active",
    createdAt: serverTimestamp()
  };

  await addDoc(collection(db, "redemptions"), redemption);

  const coupon = {
    id: couponCode,
    code: couponCode,
    reward: reward.name,
    name: reward.name,
    icon: reward.icon,
    redeemedAt: new Date().toLocaleString(),
    time: new Date().toLocaleString(),
    status: "Active",
    qr: qrUrl
  };

  await updatePoints(uid, (user.points || 0) - reward.cost);
  await addCouponToUser(uid, coupon);

  return coupon;
}