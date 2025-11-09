import React from "react";
import { Gift, Lightbulb, Users, Zap } from "lucide-react";

function Metric({ label, value, positive, negative }) {
  return (
    <div className={`rounded-lg p-3 ${positive ? "bg-emerald-50" : negative ? "bg-rose-50" : "bg-slate-100"}`}>
      <div className="text-xs font-semibold text-slate-600">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

function UpdateEnergyCard({ onSave }) {
  const [prod, setProd] = React.useState(["", "", ""]);
  const [use, setUse]   = React.useState(["", "", ""]);

  function toNum3(arr) { return arr.map(x => Number(x || 0)); }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold mb-2">Enter / Update Energy (past 3 months)</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold">Solar Production (kWh)</label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {prod.map((v,i)=>(
              <input key={i} className="border rounded px-2 py-1"
                     value={v}
                     onChange={e=>setProd(p=>p.map((x,j)=> j===i? e.target.value : x))}
                     placeholder={`M${i+1}`} />
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold">Usage (kWh)</label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {use.map((v,i)=>(
              <input key={i} className="border rounded px-2 py-1"
                     value={v}
                     onChange={e=>setUse(u=>u.map((x,j)=> j===i? e.target.value : x))}
                     placeholder={`M${i+1}`} />
            ))}
          </div>
        </div>
      </div>
      <button
        className="mt-3 bg-emerald-600 text-white rounded px-4 py-2 font-semibold"
        onClick={()=> onSave({ prod3: toNum3(prod), use3: toNum3(use) })}
      >
        Save Averages
      </button>
    </div>
  );
}

export default function Dashboard({ me, users, gridStress, aiSuggestion, onSaveEnergy }) {
  if (!me) return null;
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
        <h2 className="text-3xl font-bold">Hello, {me.name}</h2>
        <div className="mt-2 flex flex-wrap gap-3 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded"><Users className="inline mr-1" size={16}/> {users.length} Homes</span>
          <span className="bg-white/20 px-3 py-1 rounded"><Zap className="inline mr-1" size={16}/> Grid: {gridStress.toUpperCase()}</span>
          <span className="bg-white/20 px-3 py-1 rounded"><Gift className="inline mr-1" size={16}/> {me.points} pts</span>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <div className="flex items-start">
          <Lightbulb className="text-yellow-600 mr-3 mt-1" size={24}/>
          <div>
            <h3 className="font-bold text-yellow-800 mb-1">AI Suggestion</h3>
            <p className="text-yellow-700">{aiSuggestion}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 grid sm:grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold">Your House</h3>
          <p className="text-sm text-slate-600">House ID: <code className="px-2 py-1 bg-slate-100 rounded">{me.houseId}</code></p>
          <p className="text-sm text-slate-600">PO Box: {me.pobox}</p>
          <p className="text-sm text-slate-600">Address: {me.address}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Production" value={`${(me.energy?.prodAvg||0).toFixed(1)} kWh`} positive/>
          <Metric label="Usage" value={`${(me.energy?.useAvg||0).toFixed(1)} kWh`}/>
          {me.energy?.surplus>0 && <Metric label="Surplus" value={`+${me.energy.surplus.toFixed(1)} kWh`} positive/>}
          {me.energy?.deficit>0 && <Metric label="Deficit" value={`-${me.energy.deficit.toFixed(1)} kWh`} negative/>}
        </div>
      </div>

      <UpdateEnergyCard onSave={onSaveEnergy} />
    </div>
  );
}
