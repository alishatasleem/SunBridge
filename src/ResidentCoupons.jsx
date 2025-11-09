import React from "react";

export default function ResidentCoupons({ me }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold mb-2">My Coupons</h3>
      {!me?.coupons?.length && <p className="text-slate-600">No coupons yet.</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(me?.coupons||[]).map((c)=>(
          <div key={c.code} className="border rounded p-3">
            <div className="text-2xl">{c.icon}</div>
            <div className="font-bold">{c.name}</div>
            <div className="text-xs text-slate-600">{c.code}</div>
            <img src={c.qr} alt="QR" className="mt-2 w-40 h-40 object-contain mx-auto bg-white rounded"/>
            <div className="text-xs text-slate-500 mt-1">Issued: {c.time}</div>
            <div className="text-xs font-semibold mt-1">Status: {c.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
