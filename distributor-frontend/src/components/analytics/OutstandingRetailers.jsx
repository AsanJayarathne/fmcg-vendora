import { useState } from "react";
import AnalyticsCard from "./AnalyticsCard";
import { AlertCircle, BarChart2, Table as TableIcon, CheckCircle2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

function CustomOutstandingTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-800 font-sans z-50">
        <p className="font-semibold text-slate-200">{item.name}</p>
        {item.owner && <p className="text-[11px] text-slate-400">{item.owner}</p>}
        <div className="mt-1.5 space-y-0.5 border-t border-slate-800 pt-1.5">
          <p className="text-rose-400 font-bold text-sm">
            Due: LKR {Number(item.rawAmount).toLocaleString("en-LK", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-slate-400 text-[10px]">
            Credit Limit: LKR {item.creditLimit || "0"} ({item.usedPercentage}% used)
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export default function OutstandingRetailers({ retailers }) {
  const [viewMode, setViewMode] = useState("graph"); // "graph" | "table"
  const list = retailers || [];
  const totalOutstanding = list.reduce((acc, r) => acc + (r.rawAmount || 0), 0);

  // Prepare chart data for horizontal bar graph
  const chartData = list.map((item) => ({
    name: item.name.length > 14 ? item.name.substring(0, 13) + "…" : item.name,
    fullName: item.name,
    rawAmount: item.rawAmount || 0,
    creditLimit: item.creditLimit,
    usedPercentage: item.usedPercentage || 0,
    owner: item.owner,
  }));

  const maxBalance = Math.max(...list.map((d) => d.rawAmount || 0), 10000);

  return (
    <AnalyticsCard
      title="Outstanding by Retailer"
      subtitle="Highest unpaid retailer credit balances & exposure"
      icon={AlertCircle}
      action={
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl">
            <button
              onClick={() => setViewMode("graph")}
              className={`p-1.5 rounded-lg transition text-xs font-semibold cursor-pointer flex items-center gap-1 ${
                viewMode === "graph"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="Graph View"
            >
              <BarChart2 size={13} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition text-xs font-semibold cursor-pointer flex items-center gap-1 ${
                viewMode === "table"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="Table View"
            >
              <TableIcon size={13} />
            </button>
          </div>

          <span className="bg-rose-50 text-rose-600 font-bold text-xs px-2.5 py-1 rounded-xl border border-rose-100">
            LKR {totalOutstanding >= 1000 ? `${(totalOutstanding / 1000).toFixed(1)}K` : totalOutstanding.toLocaleString("en-LK")}
          </span>
        </div>
      }
    >
      <div className="min-h-[220px] flex flex-col justify-between pt-1">
        {list.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs py-8">
            <CheckCircle2 className="size-8 text-emerald-400 mb-2 stroke-1" />
            <p className="text-emerald-700 font-semibold">Zero outstanding balances!</p>
            <p className="text-slate-400 text-[11px] mt-0.5">All retailer credit accounts are fully settled</p>
          </div>
        ) : viewMode === "graph" ? (
          /* Graph View: Vertical / Horizontal Bar Chart */
          <div className="space-y-3 py-1">
            {list.slice(0, 5).map((item, idx) => (
              <div key={item.name + idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                      {item.name}
                    </span>
                    {item.owner && (
                      <span className="text-[10px] text-slate-400 truncate max-w-[90px]">
                        ({item.owner})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {item.usedPercentage}% used
                    </span>
                    <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100/60">
                      LKR {item.amount}
                    </span>
                  </div>
                </div>

                {/* Balance Progress Bar */}
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max((item.rawAmount / (maxBalance || 1)) * 100, item.rawAmount > 0 ? 5 : 0)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-3 py-2 rounded-l-xl">Retailer / Shop</th>
                  <th className="px-3 py-2 text-center">Credit Limit</th>
                  <th className="px-3 py-2 text-right rounded-r-xl">Balance Due (LKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {list.map((item) => (
                  <tr key={item.name} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-800">{item.name}</p>
                          {item.owner && (
                            <p className="text-[10px] text-slate-400">{item.owner}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center text-slate-500 font-medium">
                      LKR {item.creditLimit || "0"}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className="bg-rose-50 text-rose-600 font-bold text-xs px-2 py-0.5 rounded-lg border border-rose-100/70 inline-block">
                        LKR {item.amount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Top retailer credit liabilities</span>
          <span className="font-semibold text-slate-600">
            {list.length} accounts analyzed
          </span>
        </div>
      </div>
    </AnalyticsCard>
  );
}