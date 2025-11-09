// import { useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "./firebase";
// import { registerResident, loginResident, loginAdmin, signOut, getCurrentUserData } from "./services/auth";
// import { getAllUsers, updatePastData, updateUser } from "./services/users";
// import { getAllRewards, addReward, updateReward, deleteReward } from "./services/rewards";
// import { getAllTransactions, createEnergyTransaction, approveTransaction } from "./services/ledger";
// import { redeemReward } from "./services/redemptions";

// import AdminApprovals from "./AdminApprovals.jsx";
// import AdminCoupons from "./AdminCoupons.jsx";
// import AuthPage from "./AuthPage.jsx";
// import Dashboard from "./Dashboard.jsx";

// export default function SunBridge() {
//   const [page, setPage] = useState("auth");
//   const [current, setCurrent] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   const [users, setUsers] = useState([]);
//   const [store, setStore] = useState([]);
//   const [ledger, setLedger] = useState([]);
//   const [me, setMe] = useState(null);
  
//   const [residentTab, setResidentTab] = useState("dashboard");
//   const [prodMonths, setProdMonths] = useState(["", "", ""]);
//   const [useMonths, setUseMonths] = useState(["", "", ""]);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       setLoading(true);
//       if (user) {
//         try {
//           const userData = await getCurrentUserData(user.uid);
//           setMe(userData);
//           setCurrent({ role: userData.role || "resident", userId: user.uid });
//           setPage(userData.role === "admin" ? "admin-approvals" : "dashboard");
          
//           if (userData.role !== "admin") {
//             // Always initialize with 3 empty strings if no data exists
//             setProdMonths(userData.pastProduction?.length > 0 ? userData.pastProduction.map(String) : ["", "", ""]);
//             setUseMonths(userData.pastUsage?.length > 0 ? userData.pastUsage.map(String) : ["", "", ""]);
//           }
//         } catch (error) {
//           console.error("Error loading user data:", error);
//         }
//       } else {
//         setCurrent(null);
//         setMe(null);
//         setPage("auth");
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (current) {
//       loadRewards();
//       loadUsers(); // Load users for BOTH admin and residents
//       if (current.role === "admin") {
//         loadLedger();
//       }
//     }
//   }, [current]);

//   async function loadUsers() {
//     try {
//       const usersData = await getAllUsers();
//       setUsers(usersData);
//     } catch (error) {
//       console.error("Error loading users:", error);
//     }
//   }

//   async function loadRewards() {
//     try {
//       const rewardsData = await getAllRewards();
//       setStore(rewardsData);
//     } catch (error) {
//       console.error("Error loading rewards:", error);
//     }
//   }

//   async function loadLedger() {
//     try {
//       const ledgerData = await getAllTransactions();
//       setLedger(ledgerData);
//     } catch (error) {
//       console.error("Error loading ledger:", error);
//     }
//   }

//   async function onLoginResident(email, password) {
//     try {
//       await loginResident(email, password);
//     } catch (error) {
//       alert("Login failed: " + error.message);
//     }
//   }

//   async function onLoginAdmin(email, password) {
//     try {
//       await loginAdmin(email, password);
//     } catch (error) {
//       alert("Admin login failed: " + error.message);
//     }
//   }

//   async function onRegister(data) {
//     if (data.password !== data.confirm) {
//       alert("Passwords don't match!");
//       return;
//     }

//     try {
//       const { houseId } = await registerResident(data);
//       alert(`âœ… Registered successfully!\n\nYour House ID: ${houseId}\n\nPlease login with your email.`);
//     } catch (error) {
//       if (error.code === "auth/email-already-in-use") {
//         alert("Email already registered");
//       } else {
//         alert("Registration failed: " + error.message);
//       }
//     }
//   }

//   async function logout() {
//     try {
//       await signOut();
//       setResidentTab("dashboard");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   }

//   async function approveTx(id) {
//     try {
//       await approveTransaction(id);
//       await loadLedger();
//       alert("Transaction approved successfully!");
//     } catch (error) {
//       alert("Error approving transaction: " + error.message);
//     }
//   }

//   async function saveCoupon(c) {
//     try {
//       if (c.id) {
//         await updateReward(c.id, c);
//         alert("Reward updated!");
//       } else {
//         await addReward(c);
//         alert("Reward created!");
//       }
//       await loadRewards();
//     } catch (error) {
//       alert("Error saving reward: " + error.message);
//     }
//   }

//   async function deleteCoupon(id) {
//     try {
//       await deleteReward(id);
//       await loadRewards();
//       alert("Reward deleted!");
//     } catch (error) {
//       alert("Error deleting reward: " + error.message);
//     }
//   }

//   async function onSaveAverages() {
//     if (!current?.userId) return;
    
//     const allFilled = prodMonths.every(m => m !== "") && useMonths.every(m => m !== "");
//     if (!allFilled) {
//       alert("Please fill in all 3 months for both production and usage");
//       return;
//     }

//     try {
//       // Save the past data
//       await updatePastData(current.userId, prodMonths.map(Number), useMonths.map(Number));
      
//       // Calculate averages - sum and divide by number of months
//       const totalProd = prodMonths.reduce((sum, m) => sum + parseFloat(m || 0), 0);
//       const totalUse = useMonths.reduce((sum, m) => sum + parseFloat(m || 0), 0);
//       const avgProd = totalProd / 3;
//       const avgUse = totalUse / 3;
      
//       // Update house data with calculated values
//       const newProduction = parseFloat(avgProd.toFixed(1));
//       const newConsumption = parseFloat(avgUse.toFixed(1));
//       const surplus = Math.max(0, parseFloat((newProduction - newConsumption).toFixed(1)));
//       const deficit = Math.max(0, parseFloat((newConsumption - newProduction).toFixed(1)));
      
//       await updateUser(current.userId, {
//         houseData: {
//           production: newProduction,
//           consumption: newConsumption,
//           surplus: surplus,
//           deficit: deficit
//         }
//       });
      
//       // Refresh user data
//       const userData = await getCurrentUserData(current.userId);
//       setMe(userData);
      
//       alert(`âœ… Data saved successfully!\n\nAverage Production: ${newProduction} kWh\nAverage Usage: ${newConsumption} kWh\n${surplus > 0 ? `Surplus: +${surplus} kWh` : deficit > 0 ? `Deficit: -${deficit} kWh` : 'Balanced'}`);
//     } catch (error) {
//       alert("Error saving data: " + error.message);
//     }
//   }

//   async function onShareEnergy(targetId, amount) {
//     if (!targetId || !current?.userId || !amount) return;

//     try {
//       const pointsEarned = await createEnergyTransaction(current.userId, targetId, amount);
      
//       // Refresh both current user data and all users list
//       await loadUsers();
//       const userData = await getCurrentUserData(current.userId);
//       setMe(userData);
      
//       alert(`âœ… Energy share request submitted!\n\n${amount} kWh shared\n+${pointsEarned} points earned`);
//     } catch (error) {
//       alert("Error sharing energy: " + error.message);
//     }
//   }

//   async function onRedeem(coupon) {
//     if (!current?.userId) return;

//     if ((me?.points || 0) < coupon.cost) {
//       alert(`âŒ Not enough points!`);
//       return;
//     }

//     try {
//       await redeemReward(current.userId, coupon);
//       const userData = await getCurrentUserData(current.userId);
//       setMe(userData);
//       alert(`ðŸŽ‰ Success! Your ${coupon.name} coupon is ready!`);
//       setResidentTab("coupons");
//     } catch (error) {
//       alert("Error redeeming reward: " + error.message);
//     }
//   }

//   const isAdmin = current?.role === "admin";
//   const eligibleTargets = users.filter(u => 
//     u.id !== current?.userId && (u.houseData?.deficit || 0) > 0
//   ).sort((a, b) => (b.houseData?.deficit || 0) - (a.houseData?.deficit || 0));

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-white-50 to-amber-50 flex items-center justify-center">
//         <div className="text-xl text-gray-600">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white-50 to-amber-50 p-4">
//       <div className="max-w-6xl mx-auto">
//         {!current && page === "auth" && (
//           <AuthPage
//             onLoginResident={onLoginResident}
//             onLoginAdmin={onLoginAdmin}
//             onRegister={onRegister}
//           />
//         )}

//         {isAdmin && (
//           <>
//             <div className="bg-white rounded-lg shadow-lg p-4 mb-6 flex gap-3 items-center">
//               <button
//                 onClick={() => setPage("admin-approvals")}
//                 className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                   page === "admin-approvals" ? "bg-amber-600 text-white shadow-lg" : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 ðŸ“‹ Approvals
//               </button>
//               <button
//                 onClick={() => setPage("admin-coupons")}
//                 className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                   page === "admin-coupons" ? "bg-amber-600 text-white shadow-lg" : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 ðŸŽ Rewards
//               </button>
//               <button 
//                 onClick={logout} 
//                 className="ml-auto px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-all"
//               >
//                 ðŸšª Logout
//               </button>
//             </div>

//             {page === "admin-approvals" && (
//               <AdminApprovals ledger={ledger} onApprove={approveTx} />
//             )}
//             {page === "admin-coupons" && (
//               <AdminCoupons store={store} onSave={saveCoupon} onDelete={deleteCoupon} />
//             )}
//           </>
//         )}

//         {!isAdmin && current && me && (
//           <Dashboard
//             user={me}
//             users={{ store, allUsers: users }}
//             logout={logout}
//             onSaveAverages={onSaveAverages}
//             onShareEnergy={onShareEnergy}
//             onRedeem={onRedeem}
//             residentTab={residentTab}
//             setResidentTab={setResidentTab}
//             prodMonths={prodMonths}
//             setProdMonths={setProdMonths}
//             useMonths={useMonths}
//             setUseMonths={setUseMonths}
//             eligibleTargets={eligibleTargets}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import {
  registerResident,
  loginResident,
  loginAdmin,
  signOut,
  getCurrentUserData,
} from "./services/auth";
import { getAllUsers, updatePastData, updateUser } from "./services/users";
import { getAllRewards, addReward, updateReward, deleteReward } from "./services/rewards";
import { getAllTransactions, createEnergyTransaction, approveTransaction } from "./services/ledger";
import { redeemReward } from "./services/redemptions";

import AdminApprovals from "./AdminApprovals.jsx";
import AdminCoupons from "./AdminCoupons.jsx";
import AuthPage from "./AuthPage.jsx";
import Dashboard from "./Dashboard.jsx";

export default function SunBridge() {
  const [page, setPage] = useState("auth");
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [store, setStore] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [me, setMe] = useState(null);

  const [residentTab, setResidentTab] = useState("dashboard");
  const [prodMonths, setProdMonths] = useState(["", "", ""]);
  const [useMonths, setUseMonths] = useState(["", "", ""]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        try {
          const userData = await getCurrentUserData(user.uid);
          setMe(userData);
          setCurrent({ role: userData.role || "resident", userId: user.uid });
          setPage(userData.role === "admin" ? "admin-approvals" : "dashboard");

          if (userData.role !== "admin") {
            setProdMonths(
              userData.pastProduction?.length > 0
                ? userData.pastProduction.map(String)
                : ["", "", ""]
            );
            setUseMonths(
              userData.pastUsage?.length > 0 ? userData.pastUsage.map(String) : ["", "", ""]
            );
          }
        } catch (error) {
          // Fallback: if signed-in email is the admin email, proceed as admin even if Firestore doc missing
          if (user.email === "admin@sunbridge.com") {
            const adminFallback = {
              email: user.email,
              name: "Administrator",
              role: "admin",
              id: user.uid,
            };
            setMe(adminFallback);
            setCurrent({ role: "admin", userId: user.uid });
            setPage("admin-approvals");
          } else {
            console.error("Error loading user data:", error);
            setCurrent(null);
            setMe(null);
            setPage("auth");
          }
        }
      } else {
        setCurrent(null);
        setMe(null);
        setPage("auth");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (current) {
      loadRewards();
      loadUsers(); // Load users for BOTH admin and residents
      if (current.role === "admin") {
        loadLedger();
      }
    }
  }, [current]);

  async function loadUsers() {
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  }

  async function loadRewards() {
    try {
      const rewardsData = await getAllRewards();
      setStore(rewardsData);
    } catch (error) {
      console.error("Error loading rewards:", error);
    }
  }

  async function loadLedger() {
    try {
      const ledgerData = await getAllTransactions();
      setLedger(ledgerData);
    } catch (error) {
      console.error("Error loading ledger:", error);
    }
  }

  async function onLoginResident(email, password) {
    try {
      await loginResident(email, password);
      // onAuthStateChanged will handle routing
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  }

  async function onLoginAdmin(email, password) {
    try {
      await loginAdmin(email, password);
      // onAuthStateChanged will handle routing
    } catch (error) {
      alert("Admin login failed: " + error.message);
    }
  }

  async function onRegister(data) {
    if (data.password !== data.confirm) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const { houseId } = await registerResident(data);
      alert(
        `Registered successfully!\n\nYour House ID: ${houseId}\n\nPlease login with your email.`
      );
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Email already registered");
      } else {
        alert("Registration failed: " + error.message);
      }
    }
  }

  async function logout() {
    try {
      await signOut();
      setResidentTab("dashboard");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  async function approveTx(id) {
    try {
      await approveTransaction(id);
      await loadLedger();
      alert("Transaction approved successfully!");
    } catch (error) {
      alert("Error approving transaction: " + error.message);
    }
  }

  async function saveCoupon(c) {
    try {
      if (c.id) {
        await updateReward(c.id, c);
        alert("Reward updated!");
      } else {
        await addReward(c);
        alert("Reward created!");
      }
      await loadRewards();
    } catch (error) {
      alert("Error saving reward: " + error.message);
    }
  }

  async function deleteCoupon(id) {
    try {
      await deleteReward(id);
      await loadRewards();
      alert("Reward deleted!");
    } catch (error) {
      alert("Error deleting reward: " + error.message);
    }
  }

  async function onSaveAverages() {
    if (!current?.userId) return;

    const allFilled = prodMonths.every((m) => m !== "") && useMonths.every((m) => m !== "");
    if (!allFilled) {
      alert("Please fill in all 3 months for both production and usage");
      return;
    }

    try {
      await updatePastData(current.userId, prodMonths.map(Number), useMonths.map(Number));

      const totalProd = prodMonths.reduce((sum, m) => sum + parseFloat(m || 0), 0);
      const totalUse = useMonths.reduce((sum, m) => sum + parseFloat(m || 0), 0);
      const avgProd = totalProd / 3;
      const avgUse = totalUse / 3;

      const newProduction = parseFloat(avgProd.toFixed(1));
      const newConsumption = parseFloat(avgUse.toFixed(1));
      const surplus = Math.max(0, parseFloat((newProduction - newConsumption).toFixed(1)));
      const deficit = Math.max(0, parseFloat((newConsumption - newProduction).toFixed(1)));

      await updateUser(current.userId, {
        houseData: {
          production: newProduction,
          consumption: newConsumption,
          surplus: surplus,
          deficit: deficit,
        },
      });

      const userData = await getCurrentUserData(current.userId);
      setMe(userData);

      alert(
        `Data saved successfully!\n\nAverage Production: ${newProduction} kWh\nAverage Usage: ${newConsumption} kWh\n${
          surplus > 0 ? `Surplus: +${surplus} kWh` : deficit > 0 ? `Deficit: -${deficit} kWh` : "Balanced"
        }`
      );
    } catch (error) {
      alert("Error saving data: " + error.message);
    }
  }

  async function onShareEnergy(targetId, amount) {
    if (!targetId || !current?.userId || !amount) return;

    try {
      const pointsEarned = await createEnergyTransaction(current.userId, targetId, amount);

      await loadUsers();
      const userData = await getCurrentUserData(current.userId);
      setMe(userData);

      alert(`Energy share request submitted!\n\n${amount} kWh shared\n+${pointsEarned} points earned`);
    } catch (error) {
      alert("Error sharing energy: " + error.message);
    }
  }

  async function onRedeem(coupon) {
    if (!current?.userId) return;

    if ((me?.points || 0) < coupon.cost) {
      alert(`Not enough points!`);
      return;
    }

    try {
      await redeemReward(current.userId, coupon);
      const userData = await getCurrentUserData(current.userId);
      setMe(userData);
      alert(`Success! Your ${coupon.name} coupon is ready!`);
      setResidentTab("coupons");
    } catch (error) {
      alert("Error redeeming reward: " + error.message);
    }
  }

  const isAdmin = current?.role === "admin";
  const eligibleTargets = users
    .filter((u) => u.id !== current?.userId && (u.houseData?.deficit || 0) > 0)
    .sort((a, b) => (b.houseData?.deficit || 0) - (a.houseData?.deficit || 0));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white-50 to-amber-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-50 to-amber-50 p-4">
      <div className="max-w-6xl mx-auto">
        {!current && page === "auth" && (
          <AuthPage
            onLoginResident={onLoginResident}
            onLoginAdmin={onLoginAdmin}
            onRegister={onRegister}
          />
        )}

        {isAdmin && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6 flex gap-3 items-center">
              <button
                onClick={() => setPage("admin-approvals")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  page === "admin-approvals"
                    ? "bg-amber-600 text-white shadow-lg"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                📋 Approvals
              </button>
              <button
                onClick={() => setPage("admin-coupons")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  page === "admin-coupons"
                    ? "bg-amber-600 text-white shadow-lg"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                🎁 Rewards
              </button>
              <button
                onClick={logout}
                className="ml-auto px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-all"
              >
                🚪 Logout
              </button>
            </div>

            {page === "admin-approvals" && (
              <AdminApprovals ledger={ledger} onApprove={approveTx} />
            )}
            {page === "admin-coupons" && (
              <AdminCoupons store={store} onSave={saveCoupon} onDelete={deleteCoupon} />
            )}
          </>
        )}

        {!isAdmin && current && me && (
          <Dashboard
            user={me}
            users={{ store, allUsers: users }}
            logout={logout}
            onSaveAverages={onSaveAverages}
            onShareEnergy={onShareEnergy}
            onRedeem={onRedeem}
            residentTab={residentTab}
            setResidentTab={setResidentTab}
            prodMonths={prodMonths}
            setProdMonths={setProdMonths}
            useMonths={useMonths}
            setUseMonths={setUseMonths}
            eligibleTargets={eligibleTargets}
          />
        )}
      </div>
    </div>
  );
}