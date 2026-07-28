import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SpendingSummary({ data = defaultData }) {
  return (
    <div className="h-full w-full bg-white rounded-3xl border border-slate-100 shadow-xs p-6">

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-slate-800 text-base leading-tight">
            Spending Summary
          </h2>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Order expenditure over consecutive periods
          </p>
        </div>
        <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-blue-600 text-xs font-medium">
          Expenditure
        </span>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 8 }}>
          <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
            tickFormatter={(value) => `Rs.${value / 1000}k`}
          />
          <Tooltip
            formatter={(value) => [`Rs. ${value.toLocaleString()}`, "Spending"]}
            contentStyle={{ borderRadius: 16, borderColor: "#f1f5f9", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }}
          />
          <Bar dataKey="spending" fill="#2563eb" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

const defaultData = [
  { month: "W1", spending: 62000 },
  { month: "W2", spending: 78000 },
  { month: "W3", spending: 91000 },
  { month: "W4", spending: 84000 },
  { month: "W5", spending: 97000 },
  { month: "W6", spending: 102000 },
  { month: "W7", spending: 108000 },
  { month: "W8", spending: 116000 },
  { month: "W9", spending: 124000 },
  { month: "W10", spending: 131000 },
  { month: "W11", spending: 138000 },
  { month: "W12", spending: 145000 },
];