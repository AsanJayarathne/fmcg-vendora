import AnalyticsCard from "./AnalyticsCard";
import { TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-slate-800 font-sans">
        <p className="font-semibold text-slate-300">{label}</p>
        <p className="text-emerald-400 font-bold mt-0.5">
          LKR {val.toLocaleString("en-LK")}
        </p>
      </div>
    );
  }
  return null;
}

export default function SalesOverview({ data }) {
  const chartData = data ? data.map((item) => ({
    name: item.label,
    value: item.value,
  })) : [];

  const totalSales = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <AnalyticsCard
      title="Sales Overview"
      subtitle="Daily order revenue trends across active days"
      icon={TrendingUp}
      action={
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total</span>
          <span className="text-sm font-bold text-slate-800">
            LKR {(totalSales / 1000).toFixed(1)}K
          </span>
        </div>
      }
    >
      <div className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="salesBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Bar
              dataKey="value"
              fill="url(#salesBarGradient)"
              radius={[8, 8, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
}