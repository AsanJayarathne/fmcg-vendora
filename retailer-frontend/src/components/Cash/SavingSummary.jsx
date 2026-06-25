import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Mar", savings: 4000 },
  { month: "Apr", savings: 8000 },
  { month: "May", savings: 12000 },
  { month: "Jun", savings: 14000 },
  { month: "Jul", savings: 16000 },
  { month: "Aug", savings: 18000 },
];

 function SavingsSummary() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">

      <h2 className="text-xl font-semibold mb-5">
        Savings Summary
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
            dataKey="savings"
            fill="#9333ea"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default SavingsSummary;