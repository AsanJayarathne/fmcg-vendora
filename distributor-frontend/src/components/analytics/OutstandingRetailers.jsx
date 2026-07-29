import AnalyticsCard from "./AnalyticsCard";
import { AlertCircle } from "lucide-react";

export default function OutstandingRetailers({ retailers }) {
  const list = retailers || [];

  return (
    <AnalyticsCard
      title="Outstanding by Retailer"
      subtitle="Highest unpaid retailer credit balances"
      icon={AlertCircle}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="px-3 py-2.5 rounded-l-xl">Retailer Name</th>
              <th className="px-3 py-2.5 text-right rounded-r-xl">Outstanding</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {list.map((item) => (
              <tr key={item.name} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-3 py-3 font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>{item.name}</span>
                </td>
                <td className="px-3 py-3 text-right">
                  <span className="bg-rose-50 text-rose-600 font-bold text-xs px-2.5 py-0.5 rounded-lg inline-block">
                    LKR {item.amount}
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