import React from "react";
import { Gift } from "lucide-react";

export default function ResidentRewards({ store, me, redeem }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="font-bold text-2xl mb-4 flex items-center">
        <Gift className="mr-3 text-pink-600" size={28} />
        Rewards Store
      </h3>
      <p className="text-gray-600 mb-6">
        Redeem your points for real Calgary community benefits!
      </p>
      
      {!store || store.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Gift size={48} className="mx-auto mb-4 opacity-50" />
          <p>No rewards available yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {store.map((c) => (
            <div
              key={c.id}
              className="border-2 border-gray-200 rounded-lg p-6 hover:border-pink-400 transition-all"
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">{c.icon}</div>
                <div className="font-bold text-lg">{c.name}</div>
                <div className="text-sm text-gray-600 mt-1">{c.desc}</div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-pink-600">
                    {c.cost} pts
                  </span>
                  <button
                    onClick={() => redeem(c)}
                    disabled={!me || me.points < c.cost}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                      me && me.points >= c.cost
                        ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {me && me.points >= c.cost ? "Redeem" : "Need More"}
                  </button>
                </div>
                {me && me.points < c.cost && (
                  <div className="text-xs text-gray-500 mt-2 text-right">
                    Need {c.cost - me.points} more points
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}