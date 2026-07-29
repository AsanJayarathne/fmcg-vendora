import AnalyticsCard from "./AnalyticsCard";
import { CreditCard } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PAYMENT_COLOR_MAP = {
  Cash: "#10b981",
  Credit: "#3b82f6",
  "Cash + Credit": "#f59e0b",
  Bank: "#8b5cf6",
};

export default function PaymentBreakdown({ data, totalRevenue }) {
  const chartData = (data || []).map((item) => ({
    name: item.label,
    value: item.value,
    color: PAYMENT_COLOR_MAP[item.label] || "#94a3b8",
  }));

  return (
    <AnalyticsCard
      title="Payment Method Breakdown"
      subtitle="Revenue distribution by payment channel"
      icon={CreditCard}
    >
      <div className="flex flex-col items-center justify-center pt-2">
        <div className="relative w-full h-44 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell key={`pay-cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name) => [`${val}%`, name]}
                contentStyle={{
                  borderRadius: 12,
                  borderColor: "#f1f5f9",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
            <span className="text-sm font-bold text-slate-800 tracking-tight truncate max-w-full">
              {totalRevenue}
            </span>
            <span className="text-[10px] font-semibold uppercase text-slate-400">Total Revenue</span>
          </div>
        </div>

        <div className="w-full space-y-2 mt-2 pt-2 border-t border-slate-100">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="font-medium text-slate-700">{item.name}</span>
              </div>
              <span className="font-bold text-slate-800">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </AnalyticsCard>
  );
}