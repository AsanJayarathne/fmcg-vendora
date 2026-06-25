import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const defaultData = [
  { week: "W1", credit: 4000 },
  { week: "W2", credit: 6000 },
  { week: "W3", credit: 3500 },
  { week: "W4", credit: 7000 },
];

function normalizeChartData(data) {
  let rawData = data;

  if (!Array.isArray(rawData)) {
    if (rawData && typeof rawData === "object") {
      if (Array.isArray(rawData.week)) {
        rawData = rawData.week;
      } else {
        rawData = Object.values(rawData).find(Array.isArray) || defaultData;
      }
    } else {
      rawData = defaultData;
    }
  }

  return rawData.map((entry) => ({
    week: entry.week ?? entry.label ?? "",
    credit: entry.credit ?? entry.value ?? 0,
  }));
}

export default function CreditUsageChart({ data = defaultData }) {
  const chartData = normalizeChartData(data);

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h2 className="font-bold mb-4">Credit Usage</h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="credit" stroke="#2563eb" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}