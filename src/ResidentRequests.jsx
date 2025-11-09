import React from "react";

export default function ResidentRequests({ me, users, ledger, onRequest }) {
  const [toId, setToId] = React.useState("");
  const [amount, setAmount] = React.useState("");

  const deficitHomes = users.filter(u => (u.energy?.deficit||0) > 0 && u.id !== me?.id);
  const surplusHomes = users.filter(u => (u.energy?.surplus||0) > 0 && u.id !== me?.id);

  const canSend = (me?.energy?.surplus||0) > 0;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold mb-2">Request / Send Energy</h3>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-semibold">Select House</label>
            <select className="border rounded px-3 py-2 w-full"
                    value={toId} onChange={e=>setToId(e.target.value)}>
              <option value="">Choose a house…</option>
              {[...deficitHomes, ...surplusHomes].map(u=>(
                <option key={u.id} value={u.id}>
                  {u.name} — {u.houseId}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Amount (kWh)</label>
            <input className="border rounded px-3 py-2 w-full"
                   value={amount} onChange={e=>setAmount(e.target.value)}
                   placeholder="e.g. 3.5" />
          </div>

          <div className="flex items-end">
            <button
              className="bg-emerald-600 text-white rounded px-4 py-2 font-semibold disabled:opacity-50"
              disabled={!me || !toId || !amount}
              onClick={()=> onRequest({ toId, amount: Number(amount||0) })}
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold mb-2">My Requests</h3>
        {!ledger.filter(l=>l.fromId===me?.id || l.toId===me?.id).length && (
          <p className="text-slate-600">No requests yet.</p>
        )}
        <div className="space-y-2">
          {ledger.filter(l=>l.fromId===me?.id || l.toId===me?.id).map(t=>{
            const from = users.find(u=>u.id===t.fromId)?.name || "Unknown";
            const to   = users.find(u=>u.id===t.toId)?.name || "Unknown";
            return (
              <div key={t.id} className="border rounded p-3 flex justify-between">
                <div>
                  <div className="font-semibold">{from} → {to}</div>
                  <div className="text-sm text-slate-600">{t.amount} kWh • {new Date(t.time).toLocaleString()}</div>
                </div>
                <div className="text-sm font-semibold">{t.status}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
