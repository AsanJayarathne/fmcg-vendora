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
    const item = payload[0].payload;
    const val = item.value || 0;
    const count = item.count || 0;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-800 font-sans z-50">
        <p className="font-semibold text-slate-300">{label}</p>
        <p className="text-emerald-400 font-bold text-sm mt-0.5">
          LKR {Number(val).toLocaleString("en-LK", { minimumFractionDigits: 2 })}
        </p>
        <p className="text-slate-400 text-[11px] mt-0.5">
          {count} {count === 1 ? "order" : "orders"} processed
        </p>
      </div>
    );
  }
  return null;
}

export default function SalesOverview({ data, timeframe = "This Month" }) {
  const chartData = data && data.length > 0 ? data.map((item) => ({
    name: item.label,
    value: Number(item.value) || 0,
    count: Number(item.count) || 0,
  })) : [];

  const totalSales = chartData.reduce((acc, curr) => acc + curr.value, 0);

  const timeframeLabels = {
    "This Month": { sub: "Daily order sales volume for the current month", tag: "Month Volume" },
    "Last Month": { sub: "Daily order sales volume for the previous month", tag: "Last Month Volume" },
    "This Quarter": { sub: "Monthly order sales volume across the current quarter", tag: "Quarter Volume" },
    "All Time": { sub: "Monthly sales & revenue distribution across all time", tag: "All-Time Volume" },
  };

  const currentLabel = timeframeLabels[timeframe] || {
    sub: "Order sales revenue trends across active periods",
    tag: `${timeframe} Total`,
  };

  return (
    <AnalyticsCard
      title="Sales & Revenue Overview"
      subtitle={currentLabel.sub}
      icon={TrendingUp}
      action={
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            {currentLabel.tag}
          </span>
          <span className="text-sm font-black text-blue-600">
            LKR {totalSales >= 1000000 ? `${(totalSales / 1000000).toFixed(2)}M` : totalSales >= 1000 ? `${(totalSales / 1000).toFixed(1)}K` : totalSales.toLocaleString("en-LK")}
          </span>
        </div>
      }
    >
      <div className="h-64 w-full pt-3 min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
          <BarChart data={chartData} margin={{ top: 12, right: 12, left: -18, bottom: 4 }}>
            <defs>
              <linearGradient id="salesBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              interval={chartData.length > 15 ? Math.ceil(chartData.length / 8) : 0}
              tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, (dataMax) => (dataMax > 0 ? Math.ceil(dataMax * 1.15) : 10000)]}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
              tickFormatter={(v) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9", radius: 8 }} />
            <Bar
              dataKey="value"
              fill="url(#salesBarGradient)"
              radius={[6, 6, 2, 2]}
              maxBarSize={chartData.length > 20 ? 18 : chartData.length > 10 ? 28 : 44}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
}