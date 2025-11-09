import React from "react";

export default function ResidentRewards({ store, redeem }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold mb-2">Rewards Store</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {store.map(c=>(
          <div key={c.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="text-2xl">{c.icon}</div>
              <div className="font-bold">{c.name}</div>
              <div className="text-xs text-slate-600">{c.desc}</div>
              <div className="text-sm font-semibold text-pink-600">{c.cost} pts</div>
            </div>
            <button onClick={()=>redeem(c)} className="px-3 py-1 rounded bg-emerald-600 text-white">Redeem</button>
          </div>
        ))}
      </div>
    </div>
  );
}
