import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
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

export default function SpendingSummary() {
  return (
    <div className="h-full w-full bg-white rounded-2xl shadow-sm p-5">

      <h2 className="text-xl font-semibold mb-5">
        Spending Summary
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 8 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickFormatter={(value) => `Rs.${value / 1000}k`}
          />
          <Tooltip
            formatter={(value) => [`Rs. ${value.toLocaleString()}`, "Spending"]}
            contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}
          />
          <Bar dataKey="spending" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}