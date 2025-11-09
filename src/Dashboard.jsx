import React from "react";
import { Award, Gift, Home, LogOut, Zap, QrCode } from "lucide-react";

export default function Dashboard({
  user,
  users,
  logout,
  onSaveAverages,
  onShareEnergy,
  onRedeem,
  residentTab,
  setResidentTab,
  prodMonths,
  setProdMonths,
  useMonths,
  setUseMonths,
  eligibleTargets,
}) {
  return (
    <div className="max-w-6xl mx-auto">
      <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">SunBridge</h1>
          <p className="text-sm text-gray-600">Welcome, {user.name}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>

      <div className="flex gap-2 mb-4 flex-wrap">
        {["dashboard", "rewards", "coupons"].map((t) => (
          <button
            key={t}
            onClick={() => setResidentTab(t)}
            className={`px-4 py-2 rounded font-semibold transition-all ${
              residentTab === t ? "bg-blue-600 text-white shadow-lg" : "bg-white hover:bg-gray-50"
            }`}
          >
            {t === "dashboard" && <Home className="inline -mt-1 mr-1" size={16} />}
            {t === "rewards" && <Gift className="inline -mt-1 mr-1" size={16} />}
            {t === "coupons" && <QrCode className="inline -mt-1 mr-1" size={16} />}
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {residentTab === "dashboard" && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">House ID: {user.houseId}</h2>
                <p className="text-gray-600">{user.address}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg text-white">
                <Award className="inline mr-2" />
                <span className="font-bold text-xl">{user.points} Points</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="text-sm text-gray-600 mb-1">Solar Production Today</div>
                <div className="text-3xl font-bold text-green-600">
                  {user.houseData.production} kWh
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                <div className="text-sm text-gray-600 mb-1">Usage Today</div>
                <div className="text-3xl font-bold text-yellow-600">
                  {user.houseData.consumption} kWh
                </div>
              </div>
              <div
                className={`p-4 rounded-lg border-2 ${
                  user.houseData.surplus > 0 
                    ? "bg-green-100 border-green-300" 
                    : "bg-red-100 border-red-300"
                }`}
              >
                <div className="text-sm text-gray-600 mb-1">Net Surplus/Deficit</div>
                <div
                  className={`text-3xl font-bold ${
                    user.houseData.surplus > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {user.houseData.surplus > 0
                    ? `+${user.houseData.surplus}`
                    : user.houseData.deficit > 0 
                    ? `-${user.houseData.deficit}` 
                    : "0"}{" "}
                  kWh
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="font-bold text-lg mb-3">📊 Update Last 3 Months Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              This data helps calculate how much energy you can safely share while keeping a 20% reserve.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Production (kWh) — last 3 months
                </label>
                {prodMonths.map((val, i) => (
                  <input
                    key={i}
                    type="number"
                    placeholder={`Month ${i + 1} (e.g., 250)`}
                    value={val}
                    onChange={(e) => {
                      const copy = [...prodMonths];
                      copy[i] = e.target.value;
                      setProdMonths(copy);
                    }}
                    className="w-full border-2 border-gray-300 focus:border-blue-500 rounded px-3 py-2 mb-2"
                  />
                ))}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Usage (kWh) — last 3 months
                </label>
                {useMonths.map((val, i) => (
                  <input
                    key={i}
                    type="number"
                    placeholder={`Month ${i + 1} (e.g., 180)`}
                    value={val}
                    onChange={(e) => {
                      const copy = [...useMonths];
                      copy[i] = e.target.value;
                      setUseMonths(copy);
                    }}
                    className="w-full border-2 border-gray-300 focus:border-blue-500 rounded px-3 py-2 mb-2"
                  />
                ))}
              </div>
            </div>
            <button
              onClick={onSaveAverages}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold mt-3 hover:shadow-lg transition-all"
            >
              💾 Save Data
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="font-bold text-lg mb-3 flex items-center">
              <Zap className="mr-2 text-yellow-600" />
              Share Surplus Energy
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              🏘️ Houses sorted by most need. Share 2 kWh to earn <strong>+10 points</strong>!
            </p>
            <SelectTarget users={eligibleTargets} onShare={onShareEnergy} userSurplus={user.houseData.surplus} />
          </div>
        </>
      )}

      {residentTab === "rewards" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-3 flex items-center">
            <Gift className="mr-2 text-pink-600" />
            Available Rewards
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Redeem your points for real Calgary community benefits!
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {users.store.length === 0 && (
              <div className="text-sm text-gray-500">No rewards available yet</div>
            )}
            {users.store.map((c) => (
              <div key={c.id} className="border-2 border-gray-200 p-6 rounded-lg hover:border-pink-400 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{c.icon}</span>
                  <div>
                    <div className="font-bold text-lg">{c.name}</div>
                    <div className="text-sm text-gray-600">{c.desc}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-pink-600 text-lg">{c.cost} points</span>
                  <button
                    onClick={() => onRedeem(c)}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                      user.points >= c.cost
                        ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={user.points < c.cost}
                  >
                    {user.points >= c.cost ? "Redeem Now" : `Need ${c.cost - user.points} more`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {residentTab === "coupons" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-3 flex items-center">
            <QrCode className="mr-2 text-green-600" />
            My Redeemed Coupons
          </h3>
          {(user.coupons || []).length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <QrCode size={48} className="mx-auto mb-4 opacity-50" />
              <p>You haven't redeemed any coupons yet.</p>
              <p className="text-sm mt-2">Go to Rewards to redeem your points!</p>
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(user.coupons || []).map((c) => (
              <div key={c.id} className="border-2 border-green-200 p-4 rounded-lg bg-gradient-to-br from-green-50 to-yellow-50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl">{c.icon}</span>
                  <div>
                    <div className="font-bold">{c.reward}</div>
                    <div className="text-xs text-gray-600">Redeemed: {c.redeemedAt}</div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg mb-3">
                  <img src={c.qr} alt="QR Code" className="w-full" />
                </div>
                <div className="text-center">
                  <code className="text-xs bg-white px-2 py-1 rounded block mb-2">{c.code}</code>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-200 text-green-800">
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SelectTarget({ users, onShare, userSurplus }) {
  const [target, setTarget] = React.useState("");
  
  return (
    <>
      <select
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        className="w-full border-2 border-gray-300 focus:border-blue-500 rounded px-4 py-3 mb-3"
      >
        <option value="">— Select target house —</option>
        {users.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name} — {t.houseId} — needs {t.houseData.deficit || 0} kWh
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          if (!target) {
            alert("Please select a house first");
            return;
          }
          onShare(target);
          setTarget("");
        }}
        disabled={userSurplus <= 0}
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {userSurplus > 0 ? "⚡ Share 2 kWh (+10 points)" : "⚠️ No surplus to share"}
      </button>
    </>
  );
}