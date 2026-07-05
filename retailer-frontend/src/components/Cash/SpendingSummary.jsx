import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Mar", spending: 60000 },
  { month: "Apr", spending: 120000 },
  { month: "May", spending: 170000 },
  { month: "Jun", spending: 200000 },
  { month: "Jul", spending: 230000 },
  { month: "Aug", spending: 250000 },
];

export default function SpendingSummary() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">

      <h2 className="text-xl font-semibold mb-5">
        Spending Summary
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Bar
            dataKey="spending"
            fill="#2563eb"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}