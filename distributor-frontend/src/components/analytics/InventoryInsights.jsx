import { Boxes } from "lucide-react";

export default function InventoryInsights({ insights }) {
  const list = insights || [];

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs hover:shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-slate-800 text-base leading-tight flex items-center gap-2">
            <Boxes className="text-blue-600 size-4 shrink-0" />
            <span>Inventory Insights</span>
          </h2>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Stock levels, replenishment alerts & product movement summary
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((item) => (
          <div
            key={item.title}
            className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-all duration-200 space-y-1"
          >
            <p className="text-xs font-semibold text-slate-500">{item.title}</p>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
              {item.value}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              {item.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}