import AnalyticsCard from "./AnalyticsCard";
import { Store } from "lucide-react";

export default function SalesByRetailers({ data = [] }) {
  const list = data || [];
  const max = Math.max(...list.map((d) => d.val || d.value || 0), 1);

  return (
    <AnalyticsCard
      title="Sales by Retailers"
      subtitle="Top retail shops by revenue"
      icon={Store}
    >
      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <Store size={32} className="mb-2 opacity-30 text-blue-500" />
          <p className="text-xs font-bold text-slate-700">No retailer sales recorded yet</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Approved store orders will appear here</p>
        </div>
      ) : (
        <div className="space-y-4 py-2">
          {list.map((item, i) => {
            const rawVal = item.val ?? item.value ?? 0;
            const formattedVal =
              rawVal >= 1_000_000
                ? `LKR ${(rawVal / 1_000_000).toFixed(1)}M`
                : rawVal >= 1_000
                ? `LKR ${(rawVal / 1_000).toFixed(1)}K`
                : `LKR ${Number(rawVal).toLocaleString("en-LK")}`;

            const pct = item.pct ?? item.percentage ?? Math.round((rawVal / max) * 100);
            const colors = [
              "bg-gradient-to-r from-blue-600 to-indigo-500",
              "bg-gradient-to-r from-indigo-500 to-violet-500",
              "bg-gradient-to-r from-violet-500 to-purple-500",
              "bg-gradient-to-r from-purple-500 to-pink-500",
              "bg-gradient-to-r from-cyan-500 to-blue-500",
            ];

            return (
              <div key={item.name || i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                    <span className="truncate font-bold text-slate-800">{item.name}</span>
                    {item.orderCount && (
                      <span className="text-[10px] text-slate-400 shrink-0 font-normal">
                        ({item.orderCount} {item.orderCount === 1 ? 'order' : 'orders'})
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="font-extrabold text-slate-800">{formattedVal}</span>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100/60">
                      {typeof pct === "number" ? `${pct}%` : pct}
                    </span>
                  </div>
                </div>

                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors[i % colors.length]} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(typeof pct === "number" ? pct : parseFloat(pct) || 0, 4)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AnalyticsCard>
  );
}
