import React from "react";
import { Zap, Send, Clock, CheckCircle } from "lucide-react";

export default function ResidentRequests({ me, users, ledger, onRequest }) {
  const [toId, setToId] = React.useState("");
  const [amount, setAmount] = React.useState("");

  if (!me) return null;

  const myTransactions = (ledger || []).filter(
    (l) => l.fromId === me.id || l.toId === me.id
  );

  const deficitHomes = (users || []).filter(
    (u) => (u.houseData?.deficit || 0) > 0 && u.id !== me.id
  );
  const surplusHomes = (users || []).filter(
    (u) => (u.houseData?.surplus || 0) > 0 && u.id !== me.id
  );

  const handleSubmit = () => {
    if (!toId || !amount) {
      alert("Please select a house and enter an amount");
      return;
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    onRequest && onRequest({ toId, amount: amountNum });
    setToId("");
    setAmount("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-bold text-xl mb-4 flex items-center">
          <Send className="mr-2 text-blue-600" />
          Request / Send Energy
        </h3>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold block mb-2">
              Select House
            </label>
            <select
              className="border-2 border-gray-300 focus:border-blue-500 rounded px-4 py-3 w-full"
              value={toId}
              onChange={(e) => setToId(e.target.value)}
            >
              <option value="">Choose a house...</option>
              <optgroup label="Houses with Deficit">
                {deficitHomes.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.houseId} (needs {u.houseData.deficit} kWh)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Houses with Surplus">
                {surplusHomes.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.houseId} (has {u.houseData.surplus} kWh)
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold block mb-2">
              Amount (kWh)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              className="border-2 border-gray-300 focus:border-blue-500 rounded px-4 py-3 w-full"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 3.5"
            />
          </div>

          <div className="flex items-end">
            <button
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg px-4 py-3 font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!toId || !amount}
              onClick={handleSubmit}
            >
              <Zap className="inline mr-2" size={18} />
              Submit Request
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-bold text-xl mb-4 flex items-center">
          <Clock className="mr-2 text-orange-600" />
          My Transactions
        </h3>

        {myTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Zap size={48} className="mx-auto mb-4 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm mt-2">
              Submit an energy request above to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myTransactions.map((t) => {
              const from = users.find((u) => u.id === t.fromId);
              const to = users.find((u) => u.id === t.toId);
              const isReceiver = t.toId === me.id;
              const isPending = !t.approved;

              return (
                <div
                  key={t.id}
                  className={`border-2 rounded-lg p-4 ${
                    isPending
                      ? "border-orange-200 bg-orange-50"
                      : "border-green-200 bg-green-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-lg flex items-center gap-2">
                        {isReceiver ? (
                          <>
                            <span className="text-green-600">← Receiving from</span>
                            <span>{from?.name || "Unknown"}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-blue-600">Sending to →</span>
                            <span>{to?.name || "Unknown"}</span>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {from?.houseId} → {to?.houseId}
                      </div>
                      <div className="text-sm text-gray-600">
                        <Zap className="inline" size={14} />
                        {t.amount} kWh • {new Date(t.time).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      {isPending ? (
                        <span className="px-4 py-2 rounded-lg bg-orange-200 text-orange-800 font-semibold flex items-center gap-2">
                          <Clock size={16} />
                          Pending
                        </span>
                      ) : (
                        <span className="px-4 py-2 rounded-lg bg-green-200 text-green-800 font-semibold flex items-center gap-2">
                          <CheckCircle size={16} />
                          Approved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}