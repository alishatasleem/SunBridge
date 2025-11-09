import React from "react";
import { QrCode } from "lucide-react";

export default function ResidentCoupons({ me }) {
  const coupons = me?.coupons || [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="font-bold text-2xl mb-4 flex items-center">
        <QrCode className="mr-3 text-green-600" size={28} />
        My Redeemed Coupons
      </h3>

      {coupons.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <QrCode size={64} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No coupons redeemed yet</p>
          <p className="text-sm mt-2">
            Earn points by sharing energy, then redeem them in the Rewards store!
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div
              key={c.code || c.id}
              className="border-2 border-green-300 rounded-lg p-5 bg-gradient-to-br from-green-50 to-yellow-50"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{c.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-lg">{c.name || c.reward}</div>
                  <div className="text-xs text-gray-600">
                    {c.time || c.redeemedAt}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
                <img
                  src={c.qr}
                  alt="QR Code"
                  className="w-full h-40 object-contain"
                />
              </div>

              <div className="space-y-2">
                <code className="text-xs bg-white px-3 py-2 rounded block text-center font-mono">
                  {c.code}
                </code>
                <div className="flex justify-center">
                  <span className="px-4 py-1 rounded-full text-sm font-semibold bg-green-200 text-green-800">
                    {c.status || "Active"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}