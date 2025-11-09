import React from "react";

export default function AdminApprovals({ users, ledger, onApprove }) {
  const pending = ledger.filter(t => t.status === "pending");

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold mb-2">Approve Requests</h3>
      {!pending.length && <p className="text-slate-600">No pending requests.</p>}
      <div className="space-y-2">
        {pending.map(t=>{
          const from = users.find(u=>u.id===t.fromId)?.name || "Unknown";
          const to   = users.find(u=>u.id===t.toId)?.name || "Unknown";
          return (
            <div key={t.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{from} → {to}</div>
                <div className="text-sm text-slate-600">{t.amount} kWh • {new Date(t.time).toLocaleString()}</div>
              </div>
              <button className="px-3 py-1 rounded bg-emerald-600 text-white" onClick={()=>onApprove(t.id)}>
                Approve (+pts)
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
