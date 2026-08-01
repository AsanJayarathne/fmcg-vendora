import React from "react";
import AnalyticsCard from "./AnalyticsCard";
import { Award } from "lucide-react";

export default function TopDistributorsTable({ data = [], loading = false }) {
  return (
    <AnalyticsCard
      title="Top Distributor Partners"
      subtitle="Highest revenue contribution and order fulfillment performance"
      icon={Award}
    >
      <div className="overflow-hidden border border-slate-100 rounded-2xl bg-white shadow-2xs mt-2 font-sans">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Rank &amp; Partner</th>
                <th className="px-5 py-3.5">Territory Region</th>
                <th className="px-5 py-3.5 text-center">Fulfilled Orders</th>
                <th className="px-5 py-3.5 text-right">Gross Revenue</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-5 py-4">
                      <div className="h-5 bg-slate-100 rounded-full w-full" />
                    </td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-slate-400 font-semibold">
                    No distributor order statistics registered.
                  </td>
                </tr>
              ) : (
                data.map((p, idx) => {
                  const code = `DST-${String(p.distributor_id).padStart(3, "0")}`;
                  const rev = parseFloat(p.total_revenue || 0);

                  return (
                    <tr key={p.distributor_id || idx} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-black text-xs flex items-center justify-center border border-blue-100">
                            #{idx + 1}
                          </span>
                          <div>
                            <p className="font-bold text-slate-800 text-xs">{p.company_name || p.full_name}</p>
                            <p className="text-[10px] font-bold text-blue-600 mt-0.5">{code}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 font-semibold text-slate-600">
                        {p.region_name || "—"}
                      </td>

                      <td className="px-5 py-3.5 text-center font-bold text-slate-800">
                        {p.total_orders || 0} orders
                      </td>

                      <td className="px-5 py-3.5 text-right font-bold text-slate-900 text-sm">
                        LKR {rev.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                          {p.status || "Approved"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AnalyticsCard>
  );
}
