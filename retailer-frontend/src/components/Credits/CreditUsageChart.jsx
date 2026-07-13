import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const defaultData = [
  { week: "W1", month: "Jan", credit: 3800 },
  { week: "W2", month: "Jan", credit: 5200 },
  { week: "W3", month: "Jan", credit: 4100 },
  { week: "W4", month: "Jan", credit: 6100 },
  { week: "W5", month: "Feb", credit: 4700 },
  { week: "W6", month: "Feb", credit: 6900 },
  { week: "W7", month: "Feb", credit: 5200 },
  { week: "W8", month: "Feb", credit: 7400 },
  { week: "W9", month: "Mar", credit: 6300 },
  { week: "W10", month: "Mar", credit: 7800 },
  { week: "W11", month: "Mar", credit: 5900 },
  { week: "W12", month: "Mar", credit: 8200 },
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
    month: entry.month ?? entry.period ?? "",
    credit: entry.credit ?? entry.value ?? 0,
  }));
}

export default function CreditUsageChart({ data = defaultData }) {
  const chartData = normalizeChartData(data);

  return (
    <div className="h-full w-full bg-white p-5 rounded-xl shadow-sm">
      <h2 className="font-bold text-lg mb-4">Credit Usage</h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 24 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="week"
            tick={({ x, y, payload }) => {
              const item = chartData.find((entry) => entry.week === payload.value);
              const monthLabel = item?.month ? item.month : "";
              return (
                <g transform={`translate(${x},${y})`}>
                  <text x={0} y={0} dy={16} textAnchor="middle" fill="#475569" fontSize={12}>
                    {payload.value}
                  </text>
                  {monthLabel ? (
                    <text x={0} y={20} dy={16} textAnchor="middle" fill="#94a3b8" fontSize={11}>
                      {monthLabel}
                    </text>
                  ) : null}
                </g>
              );
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickFormatter={(value) => `Rs.${value / 1000}k`}
          />
          <Tooltip
            formatter={(value) => [`Rs. ${value.toLocaleString()}`, "Credit"]}
            contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}
          />
          <Line
            type="monotone"
            dataKey="credit"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4, fill: "#2563eb" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}