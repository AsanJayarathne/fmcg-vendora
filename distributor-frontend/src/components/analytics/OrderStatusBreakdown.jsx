import AnalyticsCard from "./AnalyticsCard";
import { CheckCircle2 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLOR_MAP = {
  Delivered: "#10b981",
  Dispatched: "#3b82f6",
  Processing: "#8b5cf6",
  Pending: "#f59e0b",
  Cancelled: "#ef4444",
};

export default function OrderStatusBreakdown({ data, totalOrders }) {
  const chartData = (data || []).map((item) => ({
    name: item.label,
    value: item.value,
    color: COLOR_MAP[item.label] || "#94a3b8",
  }));

  return (
    <AnalyticsCard
      title="Order Status Breakdown"
      subtitle="Fulfillment & delivery status distribution"
      icon={CheckCircle2}
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
                  <Cell key={`status-cell-${entry.name}`} fill={entry.color} />
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
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-slate-800 tracking-tight">{totalOrders}</span>
            <span className="text-[10px] font-semibold uppercase text-slate-400">Total Orders</span>
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