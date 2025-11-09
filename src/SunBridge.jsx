// src/SunBridge.jsx
import {
  LogIn, Shield, UserPlus, Zap
} from "lucide-react";
import { useEffect, useState } from "react";

/* ---------------------- helpers & local storage ---------------------- */
const emailOk = (e) => /^\S+@\S+\.\S+$/.test(e);
const hash8 = (s) =>
  Array.from(new TextEncoder().encode(s))
    .reduce((a, b) => (a * 33 + b) >>> 0, 5381)
    .toString(16)
    .slice(0, 8);

const ls = {
  read: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  write: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};

const DEFAULT_COUPONS = [
  { id: "cp1", name: "Calgary Transit Day Pass", cost: 50, icon: "🚌", desc: "All-day transit" },
  { id: "cp2", name: "Co-op Grocery $10",        cost: 100, icon: "🛒", desc: "$10 off groceries" },
  { id: "cp3", name: "Tim Hortons $5",           cost: 75,  icon: "☕", desc: "Coffee & snack" },
];

const keyUSERS  = "sb_users";
const keyCOUPS  = "sb_storeCoupons";
const keyLEDGER = "sb_ledger";

/* --------------------------------------------------------------- */

function SunBridge() {
  // app state
  const [page, setPage] = useState("auth");
  const [authTab, setAuthTab] = useState("login-resident"); // default to Resident Login
  const [current, setCurrent] = useState(null);             // {role:'resident'|'admin', userId?}

  // persistent data
  const [users, setUsers]   = useState(() => ls.read(keyUSERS, []));
  const [store, setStore]   = useState(() => ls.read(keyCOUPS, DEFAULT_COUPONS));
  const [ledger, setLedger] = useState(() => ls.read(keyLEDGER, []));

  useEffect(() => ls.write(keyUSERS, users), [users]);
  useEffect(() => ls.write(keyCOUPS, store), [store]);
  useEffect(() => ls.write(keyLEDGER, ledger), [ledger]);

  // --- minimal placeholder so the page renders ---
  const gridStress = "low";

  /* ---------------------- AUTH STATE ---------------------- */
  const [auth, setAuth] = useState({
    email: "", password: "", houseOrEmail: "", name: "", address: "", pobox: "", confirm: ""
  });

  const genHouseIdFromPO = (pobox) => `SB-${pobox}-${hash8(pobox).slice(0,4).toUpperCase()}`;

  /* ---------------------- submit handlers (temporary safe stubs) ---------------------- */
  function registerResident(e) { e.preventDefault(); /* wire up later */ }
  function loginResident(e)   { e.preventDefault(); /* wire up later */ }
  function loginAdmin(e)      { e.preventDefault(); /* wire up later */ }
  function logout()           { /* wire up later */ }

  /* ---------------------- placeholder TopBar so it doesn't crash ---------------------- */
  function TopBar() { return null; }

  /* ---------------------- PAGES ---------------------- */
// --- replace ONLY this component in SunBridge.jsx ---
const AuthPage = () => (
  <div className="max-w-5xl mx-auto">
    {/* header (badge removed to avoid undefined gridStress) */}
    <div className="text-center mb-6">
      <h1 className="mt-3 text-3xl font-extrabold">Welcome to SunBridge</h1>
      <p className="text-slate-600">Community-powered energy sharing</p>
    </div>

    {/* tabs */}
    <div className="flex flex-wrap gap-4 justify-center mb-4">
      <button
        onClick={() => setAuthTab("login-resident")}
        className={`px-4 py-2 rounded ${
          authTab === "login-resident" ? "bg-blue-600 text-white" : "bg-slate-200"
        }`}
      >
        <LogIn className="inline -mt-1 mr-1" size={16} />
        Resident Login
      </button>
      <button
        onClick={() => setAuthTab("login-admin")}
        className={`px-4 py-2 rounded ${
          authTab === "login-admin" ? "bg-purple-600 text-white" : "bg-slate-200"
        }`}
      >
        <Shield className="inline -mt-1 mr-1" size={16} />
        Admin Login
      </button>
      <button
        onClick={() => setAuthTab("register")}
        className={`px-4 py-2 rounded ${
          authTab === "register" ? "bg-emerald-600 text-white" : "bg-slate-200"
        }`}
      >
        <UserPlus className="inline -mt-1 mr-1" size={16} />
        Register
      </button>
    </div>

    {/* RESIDENT LOGIN */}
    {authTab === "login-resident" && (
      <form
        onSubmit={loginResident}
        className="bg-white p-6 rounded-lg shadow grid gap-3 max-w-lg mx-auto"
      >
        <label className="block text-sm font-semibold mb-1">
          Email or House ID
        </label>
        <input
          className="w-full border rounded px-3 py-2"
          value={auth.houseOrEmail}
          onChange={(e) =>
            setAuth((a) => ({ ...a, houseOrEmail: e.target.value }))
          }
          placeholder="e.g., SB-12345-ABCD or user@email.com"
        />
        <label className="block text-sm font-semibold mb-1">Password</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={auth.password}
          onChange={(e) => setAuth((a) => ({ ...a, password: e.target.value }))}
        />
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white rounded px-4 py-2 font-semibold"
        >
          Sign In
        </button>
      </form>
    )}

    {/* ADMIN LOGIN */}
    {authTab === "login-admin" && (
      <form
        onSubmit={loginAdmin}
        className="bg-white p-6 rounded-lg shadow grid gap-3 max-w-lg mx-auto"
      >
        <label className="block text-sm font-semibold mb-1">Admin Email</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={auth.email}
          onChange={(e) => setAuth((a) => ({ ...a, email: e.target.value }))}
          placeholder="admin@sunbridge"
        />
        <label className="block text-sm font-semibold mb-1">Password</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={auth.password}
          onChange={(e) => setAuth((a) => ({ ...a, password: e.target.value }))}
        />
        <button
          type="submit"
          className="mt-2 bg-purple-600 text-white rounded px-4 py-2 font-semibold"
        >
          Admin Sign In
        </button>
      </form>
    )}

    {/* REGISTER — neatly aligned fields */}
    {authTab === "register" && (
      <form
        onSubmit={registerResident}
        className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={auth.name}
              onChange={(e) => setAuth((a) => ({ ...a, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={auth.email}
              onChange={(e) => setAuth((a) => ({ ...a, email: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Password (≥6)
            </label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={auth.password}
              onChange={(e) =>
                setAuth((a) => ({ ...a, password: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={auth.confirm}
              onChange={(e) =>
                setAuth((a) => ({ ...a, confirm: e.target.value }))
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">
              House Address
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              value={auth.address}
              onChange={(e) =>
                setAuth((a) => ({ ...a, address: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              PO Box (unique)
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              value={auth.pobox}
              onChange={(e) =>
                setAuth((a) => ({ ...a, pobox: e.target.value }))
              }
            />
            {auth.pobox && (
              <p className="text-xs text-slate-600 mt-1">
                House ID will be: <b>{genHouseIdFromPO(auth.pobox)}</b>
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-emerald-600 text-white rounded px-4 py-3 font-semibold"
        >
          Create Account
        </button>
      </form>
    )}
  </div>
);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {current && <TopBar />}
        {!current && <AuthPage />}
        {/* rest of routing can come back once you re-enable the other pages */}
      </div>
    </div>
  );
}

export default SunBridge;
