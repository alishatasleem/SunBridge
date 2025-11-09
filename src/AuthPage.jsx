import { LogIn, Shield, UserPlus } from "lucide-react";
import React from "react";

export default function AuthPage({ onLoginResident, onLoginAdmin, onRegister }) {
  const [tab, setTab] = React.useState("login-resident");

  const [lr, setLR] = React.useState({ houseOrEmail: "", password: "" });
  const [la, setLA] = React.useState({ email: "", password: "" });
  const [reg, setReg] = React.useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    address: "",
    pobox: "",
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome to SunBridge</h1>
        <p className="text-gray-600 text-lg">Community-powered energy sharing platform</p>
        <p className="text-sm text-gray-500 mt-1">Calgary, Alberta</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <button
          onClick={() => setTab("login-resident")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            tab === "login-resident" 
              ? "bg-blue-600 text-white shadow-lg" 
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <LogIn className="inline -mt-1 mr-2" size={18} />
          Resident Login
        </button>
        <button
          onClick={() => setTab("login-admin")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            tab === "login-admin" 
              ? "bg-purple-600 text-white shadow-lg" 
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <Shield className="inline -mt-1 mr-2" size={18} />
          Admin Login
        </button>
        <button
          onClick={() => setTab("register")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            tab === "register" 
              ? "bg-emerald-600 text-white shadow-lg" 
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <UserPlus className="inline -mt-1 mr-2" size={18} />
          Register
        </button>
      </div>

      {tab === "login-resident" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLoginResident(lr.houseOrEmail.trim(), lr.password);
          }}
          className="bg-white p-8 rounded-lg shadow-lg grid gap-4 max-w-lg mx-auto"
        >
          <h2 className="text-xl font-bold mb-2">Resident Login</h2>
          <div>
            <label className="text-sm font-semibold block mb-2">Email or House ID</label>
            <input
              className="border-2 border-gray-300 focus:border-blue-500 rounded px-4 py-3 w-full"
              value={lr.houseOrEmail}
              onChange={(e) => setLR((s) => ({ ...s, houseOrEmail: e.target.value }))}
              placeholder="e.g., SB-12345-ABCD or user@email.com"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-2">Password</label>
            <input
              type="password"
              className="border-2 border-gray-300 focus:border-blue-500 rounded px-4 py-3 w-full"
              value={lr.password}
              onChange={(e) => setLR((s) => ({ ...s, password: e.target.value }))}
              autoComplete="current-password"
              required
            />
          </div>
          <button 
            type="submit" 
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 font-semibold transition-all"
          >
            Sign In
          </button>
        </form>
      )}

      {tab === "login-admin" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLoginAdmin(la.email.trim(), la.password);
          }}
          className="bg-white p-8 rounded-lg shadow-lg grid gap-4 max-w-lg mx-auto"
        >
          <h2 className="text-xl font-bold mb-2">Admin Login</h2>
          <div>
            <label className="text-sm font-semibold block mb-2">Admin Email</label>
            <input
              className="border-2 border-gray-300 focus:border-purple-500 rounded px-4 py-3 w-full"
              value={la.email}
              onChange={(e) => setLA((s) => ({ ...s, email: e.target.value }))}
              placeholder="admin@sunbridge.com"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-2">Password</label>
            <input
              type="password"
              className="border-2 border-gray-300 focus:border-purple-500 rounded px-4 py-3 w-full"
              value={la.password}
              onChange={(e) => setLA((s) => ({ ...s, password: e.target.value }))}
              autoComplete="current-password"
              required
            />
          </div>
          <button 
            type="submit" 
            className="mt-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-3 font-semibold transition-all"
          >
            Admin Sign In
          </button>
          <p className="text-xs text-gray-500 text-center">
            Demo: Use any email containing "admin" with password length ≥ 3
          </p>
        </form>
      )}

      {tab === "register" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onRegister(reg);
          }}
          className="bg-white p-8 rounded-lg shadow-lg grid gap-4 max-w-2xl mx-auto"
        >
          <h2 className="text-xl font-bold mb-2">Create Account</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold block mb-2">Full Name</label>
              <input
                className="border-2 border-gray-300 focus:border-emerald-500 rounded px-4 py-3 w-full"
                value={reg.name}
                onChange={(e) => setReg((s) => ({ ...s, name: e.target.value }))}
                placeholder="John Doe"
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">Email</label>
              <input
                type="email"
                className="border-2 border-gray-300 focus:border-emerald-500 rounded px-4 py-3 w-full"
                value={reg.email}
                onChange={(e) => setReg((s) => ({ ...s, email: e.target.value }))}
                placeholder="john@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">Password (min 6 chars)</label>
              <input
                type="password"
                className="border-2 border-gray-300 focus:border-emerald-500 rounded px-4 py-3 w-full"
                value={reg.password}
                onChange={(e) => setReg((s) => ({ ...s, password: e.target.value }))}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">Confirm Password</label>
              <input
                type="password"
                className="border-2 border-gray-300 focus:border-emerald-500 rounded px-4 py-3 w-full"
                value={reg.confirm}
                onChange={(e) => setReg((s) => ({ ...s, confirm: e.target.value }))}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold block mb-2">House Address</label>
              <input
                className="border-2 border-gray-300 focus:border-emerald-500 rounded px-4 py-3 w-full"
                value={reg.address}
                onChange={(e) => setReg((s) => ({ ...s, address: e.target.value }))}
                placeholder="123 Main St, Calgary, AB"
                autoComplete="street-address"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">PO Box (unique identifier)</label>
              <input
                className="border-2 border-gray-300 focus:border-emerald-500 rounded px-4 py-3 w-full"
                value={reg.pobox}
                onChange={(e) => setReg((s) => ({ ...s, pobox: e.target.value }))}
                placeholder="12345"
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-3 font-semibold transition-all"
          >
            Create Account
          </button>
        </form>
      )}
    </div>
  );
}