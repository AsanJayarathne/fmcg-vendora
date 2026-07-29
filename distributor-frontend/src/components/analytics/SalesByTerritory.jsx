import AnalyticsCard from "./AnalyticsCard";
import { MapPin } from "lucide-react";

export default function SalesByTerritory({ data }) {
  const list = data || [];
  const max = Math.max(...list.map((d) => d.value), 1);

  return (
    <AnalyticsCard
      title="Sales by Territory"
      subtitle="Regional revenue distribution & volume share"
      icon={MapPin}
    >
      <div className="space-y-4 py-2">
        {list.map((item) => (
          <div key={item.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>{item.name}</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">
                  LKR {item.value}M
                </span>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                  {item.percentage}
                </span>
              </div>
            </div>

            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${(item.value / max) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </AnalyticsCard>
  );
}