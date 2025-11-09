import { useEffect, useState } from "react";
import AdminApprovals from "./AdminApprovals.jsx";
import AdminCoupons from "./AdminCoupons.jsx";
import AuthPage from "./AuthPage.jsx";
import Dashboard from "./Dashboard.jsx";

const ls = {
  read: (k, d) => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    } catch {
      return d;
    }
  },
  write: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};

const KEY_USERS = "sb_users";
const KEY_COUPS = "sb_storeCoupons";
const KEY_LEDGER = "sb_ledger";

const DEFAULT_COUPONS = [
  { id: "cp1", name: "Calgary Transit Day Pass", cost: 50, icon: "🚌", desc: "All-day transit" },
  { id: "cp2", name: "Co-op Grocery Voucher", cost: 100, icon: "🛒", desc: "$25 value" },
  { id: "cp3", name: "Portable Heater Credit", cost: 150, icon: "🔥", desc: "Winter essentials" },
  { id: "cp4", name: "Community Garden Plot", cost: 75, icon: "🌱", desc: "Growing space" },
];

export default function SunBridge() {
  const [page, setPage] = useState("auth");
  const [current, setCurrent] = useState(null);
  
  const [users, setUsers] = useState(() => ls.read(KEY_USERS, []));
  const [store, setStore] = useState(() => ls.read(KEY_COUPS, DEFAULT_COUPONS));
  const [ledger, setLedger] = useState(() => ls.read(KEY_LEDGER, []));
  
  const [residentTab, setResidentTab] = useState("dashboard");
  const [prodMonths, setProdMonths] = useState(["", "", ""]);
  const [useMonths, setUseMonths] = useState(["", "", ""]);

  useEffect(() => ls.write(KEY_USERS, users), [users]);
  useEffect(() => ls.write(KEY_COUPS, store), [store]);
  useEffect(() => ls.write(KEY_LEDGER, ledger), [ledger]);

  const calculateShareableEnergy = (houseData, pastProduction, pastUsage) => {
    const totalProd = pastProduction.reduce((sum, m) => sum + parseFloat(m || 0), 0);
    const totalUse = pastUsage.reduce((sum, m) => sum + parseFloat(m || 0), 0);
    const monthlyAvgProd = totalProd / 3;
    const monthlyAvgUse = totalUse / 3;
    const dailyAvgProd = monthlyAvgProd / 30;
    const dailyAvgUse = monthlyAvgUse / 30;

    const reserveA = dailyAvgUse * 1.2;
    const reserveB = 2;
    const reserve = Math.max(reserveA, reserveB);
    const shareable = Math.max(0, houseData.production - reserve);

    return {
      dailyAvgProd: dailyAvgProd.toFixed(1),
      dailyAvgUse: dailyAvgUse.toFixed(1),
      reserve: reserve.toFixed(1),
      shareable: shareable.toFixed(1),
      canShare: shareable > 0
    };
  };

  function onLoginResident(houseOrEmail, password) {
    const found = users.find(
      (u) => (u.email === houseOrEmail || u.houseId === houseOrEmail) && u.password === password
    );
    if (found) {
      setCurrent({ role: "resident", userId: found.id });
      setPage("dashboard");
      setResidentTab("dashboard");
    } else {
      alert("Invalid resident credentials");
    }
  }

  function onLoginAdmin(email, password) {
    if (email.includes("admin") && password.length >= 3) {
      setCurrent({ role: "admin" });
      setPage("admin-approvals");
    } else {
      alert("Invalid admin credentials");
    }
  }

  function onRegister(data) {
    if (data.password !== data.confirm) {
      alert("Passwords don't match");
      return;
    }
    if (users.some((u) => u.pobox === data.pobox)) {
      alert("PO Box already registered");
      return;
    }
    if (users.some((u) => u.email === data.email)) {
      alert("Email already registered");
      return;
    }

    const id = Math.random().toString(36).slice(2, 10).toUpperCase();
    const houseId = `SB-${data.pobox}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const newUser = {
      id,
      name: data.name,
      email: data.email,
      password: data.password,
      address: data.address,
      pobox: data.pobox,
      houseId,
      role: "resident",
      points: 0,
      coupons: [],
      houseData: { 
        production: Math.floor(Math.random() * 10) + 10, 
        consumption: Math.floor(Math.random() * 8) + 5,
        surplus: 0,
        deficit: 0
      },
      pastProduction: [
        Math.floor(Math.random() * 100) + 200, 
        Math.floor(Math.random() * 100) + 200, 
        Math.floor(Math.random() * 100) + 200
      ],
      pastUsage: [
        Math.floor(Math.random() * 100) + 150, 
        Math.floor(Math.random() * 100) + 150, 
        Math.floor(Math.random() * 100) + 150
      ],
    };
    
    newUser.houseData.surplus = Math.max(0, newUser.houseData.production - newUser.houseData.consumption);
    newUser.houseData.deficit = Math.max(0, newUser.houseData.consumption - newUser.houseData.production);

    setUsers((old) => [newUser, ...old]);
    alert(`✅ Registered successfully!\n\nYour House ID: ${houseId}\n\nPlease login with your email or House ID.`);
  }

  function logout() {
    setCurrent(null);
    setPage("auth");
    setResidentTab("dashboard");
  }

  function approveTx(id) {
    setLedger((old) => 
      old.map((t) => (t.id === id ? { ...t, approved: true, status: "Approved" } : t))
    );
    alert("Transaction approved successfully!");
  }

  function saveCoupon(c) {
    setStore((old) => {
      if (c.id) {
        return old.map((x) => (x.id === c.id ? { ...x, ...c } : x));
      }
      return [...old, { ...c, id: `cp-${Date.now()}` }];
    });
    alert(c.id ? "Reward updated!" : "Reward created!");
  }

  function deleteCoupon(id) {
    setStore((old) => old.filter((x) => x.id !== id));
    alert("Reward deleted!");
  }

  function onSaveAverages() {
    if (!current?.userId) return;
    
    const allFilled = prodMonths.every(m => m !== "") && useMonths.every(m => m !== "");
    if (!allFilled) {
      alert("Please fill in all 3 months for both production and usage");
      return;
    }

    setUsers(old => old.map(u => {
      if (u.id === current.userId) {
        return {
          ...u,
          pastProduction: prodMonths.map(m => parseFloat(m)),
          pastUsage: useMonths.map(m => parseFloat(m))
        };
      }
      return u;
    }));
    
    alert("✅ Data saved successfully! You can now share energy safely.");
  }

  function onShareEnergy(targetId) {
    if (!targetId) {
      alert("Please select a target house");
      return;
    }

    const me = users.find(u => u.id === current.userId);
    const target = users.find(u => u.id === targetId);
    
    if (!me || !target) return;

    const calc = calculateShareableEnergy(me.houseData, me.pastProduction, me.pastUsage);
    const shareAmount = 2;

    if (!calc.canShare || parseFloat(calc.shareable) < shareAmount) {
      alert(`⚠️ You can only safely share ${calc.shareable} kWh today.\n\nThis protects your household's energy needs based on your 3-month average + 20% reserve.`);
      return;
    }

    const txId = `tx-${Date.now()}`;
    const newTx = {
      id: txId,
      fromId: me.id,
      toId: target.id,
      from: me.houseId,
      to: target.houseId,
      amount: shareAmount,
      timestamp: new Date().toLocaleString(),
      time: Date.now(),
      approved: false,
      status: "Pending Approval"
    };

    setLedger(old => [newTx, ...old]);

    setUsers(old => old.map(u => {
      if (u.id === me.id) {
        const newProd = u.houseData.production - shareAmount;
        return {
          ...u,
          points: u.points + 10,
          houseData: {
            ...u.houseData,
            production: newProd,
            surplus: Math.max(0, newProd - u.houseData.consumption),
            deficit: Math.max(0, u.houseData.consumption - newProd)
          }
        };
      }
      if (u.id === target.id) {
        const newCons = Math.max(0, u.houseData.consumption - shareAmount);
        return {
          ...u,
          houseData: {
            ...u.houseData,
            consumption: newCons,
            surplus: Math.max(0, u.houseData.production - newCons),
            deficit: Math.max(0, newCons - u.houseData.production)
          }
        };
      }
      return u;
    }));

    alert(`✅ Energy share request submitted!\n\n+10 points earned\n\nAwaiting admin approval.`);
  }

  function onRedeem(coupon) {
    const me = users.find(u => u.id === current.userId);
    if (!me) return;

    if (me.points < coupon.cost) {
      alert(`❌ Not enough points!\n\nYou need ${coupon.cost - me.points} more points to redeem this reward.`);
      return;
    }

    const couponCode = `RG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(couponCode)}`;
    
    const newCoupon = {
      id: couponCode,
      code: couponCode,
      reward: coupon.name,
      name: coupon.name,
      icon: coupon.icon,
      redeemedAt: new Date().toLocaleString(),
      time: new Date().toLocaleString(),
      status: "Active",
      qr: qrUrl
    };

    setUsers(old => old.map(u => {
      if (u.id === current.userId) {
        return {
          ...u,
          points: u.points - coupon.cost,
          coupons: [...(u.coupons || []), newCoupon]
        };
      }
      return u;
    }));

    alert(`🎉 Success!\n\nYour ${coupon.name} coupon is ready!\n\nCheck "My Coupons" to view your QR code.`);
    setResidentTab("coupons");
  }

  const isAdmin = current?.role === "admin";
  const me = users.find(u => u.id === current?.userId);
  
  const eligibleTargets = users.filter(u => 
    u.id !== current?.userId && (u.houseData?.deficit || 0) > 0
  ).sort((a, b) => (b.houseData?.deficit || 0) - (a.houseData?.deficit || 0));

  useEffect(() => {
    if (current?.userId && me) {
      setProdMonths(me.pastProduction?.map(String) || ["", "", ""]);
      setUseMonths(me.pastUsage?.map(String) || ["", "", ""]);
    }
  }, [current?.userId, me?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
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
                  page === "admin-approvals" ? "bg-purple-600 text-white shadow-lg" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                📋 Approvals
              </button>
              <button
                onClick={() => setPage("admin-coupons")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  page === "admin-coupons" ? "bg-purple-600 text-white shadow-lg" : "bg-gray-100 hover:bg-gray-200"
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
            users={{ store }}
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