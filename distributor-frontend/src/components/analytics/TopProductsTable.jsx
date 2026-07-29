import AnalyticsCard from "./AnalyticsCard";
import { PackageSearch } from "lucide-react";

export default function TopProductsTable({ products }) {
  const list = products || [];

  return (
    <AnalyticsCard
      title="Top Performing Products"
      subtitle="Highest revenue generating product lines"
      icon={PackageSearch}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="px-3 py-2.5 rounded-l-xl">#</th>
              <th className="px-3 py-2.5">Product</th>
              <th className="px-3 py-2.5 text-right">Orders</th>
              <th className="px-3 py-2.5 text-right rounded-r-xl">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {list.map((item, idx) => (
              <tr key={item.name} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-3 py-3 font-bold text-slate-400">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                </td>
                <td className="px-3 py-3 font-semibold text-slate-800 line-clamp-1 max-w-[160px]">
                  {item.name}
                </td>
                <td className="px-3 py-3 text-right font-medium text-slate-600">
                  {item.orders}
                </td>
                <td className="px-3 py-3 text-right">
                  <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-2 py-0.5 rounded-lg inline-block">
                    LKR {item.revenue}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnalyticsCard>
  );
}