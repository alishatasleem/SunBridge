import React from "react";

export default function AuthPage({
  authTab,            // "resident" | "admin" | "register"
  setAuthTab,
  onLoginResident,    // (email, password) => void
  onLoginAdmin,       // (adminEmail, adminPassword) => void
  onRegister          // (payloadObject) => void
}) {
  // --- local state only (so fields don't reset while typing) ---
  const [resident, setResident] = React.useState({ email: "", password: "" });
  const [admin, setAdmin]       = React.useState({ email: "", password: "" });
  const [reg, setReg]           = React.useState({
    name: "", email: "", password: "", confirm: "",
    address: "", pobox: ""
  });

  const TabButton = ({id, children}) => (
    <button
      type="button"
      onClick={() => setAuthTab(id)}
      className={
        "px-4 py-2 rounded-lg text-sm font-medium " +
        (authTab === id
          ? "bg-emerald-600 text-white"
          : "bg-slate-200 hover:bg-slate-300")
      }
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* header (no 'Grid: demo' tag anymore) */}
      <h1 className="text-3xl font-extrabold text-center">Welcome to SunBridge</h1>
      <p className="text-center text-slate-600 mb-6">Community-powered energy sharing</p>

      {/* tabs */}
      <div className="flex gap-2 justify-center mb-8">
        <TabButton id="resident">Resident Login</TabButton>
        <TabButton id="admin">Admin Login</TabButton>
        <TabButton id="register">Register</TabButton>
      </div>

      {/* panels */}
      <div className="bg-white rounded-xl shadow p-6">
        {authTab === "resident" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onLoginResident?.(resident.email.trim(), resident.password);
            }}
            className="grid gap-6 sm:grid-cols-2"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full border rounded-lg px-3 py-2"
                value={resident.email}
                onChange={(e) => setResident(s => ({ ...s, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full border rounded-lg px-3 py-2"
                value={resident.password}
                onChange={(e) => setResident(s => ({ ...s, password: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="w-full py-3 rounded-lg bg-emerald-600 text-white font-semibold">
                Sign In
              </button>
            </div>
          </form>
        )}

        {authTab === "admin" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onLoginAdmin?.(admin.email.trim(), admin.password);
            }}
            className="grid gap-6 sm:grid-cols-2"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Admin Email</label>
              <input
                type="email"
                required
                className="w-full border rounded-lg px-3 py-2"
                value={admin.email}
                onChange={(e) => setAdmin(s => ({ ...s, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full border rounded-lg px-3 py-2"
                value={admin.password}
                onChange={(e) => setAdmin(s => ({ ...s, password: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="w-full py-3 rounded-lg bg-slate-900 text-white font-semibold">
                Admin Sign In
              </button>
            </div>
          </form>
        )}

        {authTab === "register" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (reg.password.length < 6) return alert("Password must be ≥ 6 characters");
              if (reg.password !== reg.confirm) return alert("Passwords do not match");
              onRegister?.({
                name: reg.name.trim(),
                email: reg.email.trim(),
                password: reg.password,
                address: reg.address.trim(),
                pobox: reg.pobox.trim()
              });
            }}
            className="grid gap-6 sm:grid-cols-2"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={reg.name}
                onChange={(e) => setReg(s => ({ ...s, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2"
                value={reg.email}
                onChange={(e) => setReg(s => ({ ...s, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password (≥6)</label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2"
                value={reg.password}
                onChange={(e) => setReg(s => ({ ...s, password: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2"
                value={reg.confirm}
                onChange={(e) => setReg(s => ({ ...s, confirm: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">House Address</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={reg.address}
                onChange={(e) => setReg(s => ({ ...s, address: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">PO Box (unique)</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={reg.pobox}
                onChange={(e) => setReg(s => ({ ...s, pobox: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="w-full py-3 rounded-lg bg-emerald-600 text-white font-semibold">
                Create Account
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
