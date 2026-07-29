import AnalyticsCard from "./AnalyticsCard";
import { UserPlus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function CustomGrowthTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-slate-800 font-sans">
        <p className="font-semibold text-slate-300">{label}</p>
        <p className="text-purple-400 font-bold mt-0.5">
          +{val} New Retailers
        </p>
      </div>
    );
  }
  return null;
}

export default function RetailerGrowth({ data }) {
  const chartData = (data || []).map((item) => ({
    name: item.month,
    value: item.value,
  }));

  const totalNew = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <AnalyticsCard
      title="Retailer Growth"
      subtitle="Monthly new retailer onboardings"
      icon={UserPlus}
      action={
        <span className="bg-purple-50 text-purple-700 font-bold text-xs px-2.5 py-1 rounded-xl">
          +{totalNew} Total
        </span>
      }
    >
      <div className="h-44 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="purpleGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
                <stop offset="100%" stopColor="#7e22ce" stopOpacity={0.8} />
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
            />
            <Tooltip content={<CustomGrowthTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Bar
              dataKey="value"
              fill="url(#purpleGrowthGradient)"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
}