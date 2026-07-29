import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const defaultSavingsData = [
  { month: "Jan", savings: 4200 },
  { month: "Feb", savings: 7800 },
  { month: "Mar", savings: 10500 },
  { month: "Apr", savings: 13200 },
  { month: "May", savings: 16800 },
  { month: "Jun", savings: 19500 },
];

export default function SavingsSummary({ data = defaultSavingsData }) {
  const chartData = Array.isArray(data) && data.length > 0 ? data : defaultSavingsData;

  return (
    <div className="h-full w-full bg-white rounded-3xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-slate-800 text-base leading-tight">
              Savings Summary
            </h2>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Accumulated bulk discount savings over time
            </p>
          </div>
          <span className="rounded-full bg-purple-50 border border-purple-100 px-3 py-1 text-purple-600 text-xs font-medium">
            Promotions
          </span>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
              tickFormatter={(val) => `Rs.${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip
              formatter={(value) => [`Rs. ${Number(value).toLocaleString()}`, "Savings"]}
              contentStyle={{ borderRadius: 16, borderColor: "#f1f5f9", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }}
            />
            <Bar dataKey="savings" fill="#9333ea" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}