import React from "react";
import { CheckCircle, Clock } from "lucide-react";

export default function AdminApprovals({ ledger = [], onApprove }) {
  const pending = ledger.filter(t => !t.approved);
  const approved = ledger.filter(t => t.approved);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Clock className="mr-2 text-orange-600" />
          Pending Approvals ({pending.length})
        </h2>

        {pending.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            No pending transfers at the moment.
          </div>
        )}

        <div className="space-y-3">
          {pending.map((t) => (
            <div
              key={t.id}
              className="border-2 border-orange-200 rounded-lg p-4 flex items-center justify-between bg-orange-50"
            >
              <div>
                <div className="font-bold text-lg">
                  {t.from} → {t.to}
                </div>
                <div className="text-sm text-gray-600">
                  {t.amount} kWh • {t.timestamp}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Transaction ID: {t.id}
                </div>
              </div>

              <button
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all"
                onClick={() => onApprove && onApprove(t.id)}
              >
                ✓ Approve
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <CheckCircle className="mr-2 text-green-600" />
          Approved Transfers ({approved.length})
        </h2>

        {approved.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            No approved transfers yet.
          </div>
        )}

        <div className="space-y-3">
          {approved.map((t) => (
            <div
              key={t.id}
              className="border-2 border-green-200 rounded-lg p-4 bg-green-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-lg">
                    {t.from} → {t.to}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t.amount} kWh • {t.timestamp}
                  </div>
                </div>
                <span className="px-4 py-2 rounded-lg bg-green-200 text-green-800 font-semibold">
                  Approved ✓
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}