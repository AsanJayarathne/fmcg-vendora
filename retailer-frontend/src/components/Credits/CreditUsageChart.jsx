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
    <div className="h-full w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-slate-800 text-base leading-tight">Credit Usage</h2>
          <p className="text-xs text-slate-400 font-normal mt-0.5">Historical credit utilization pattern</p>
        </div>
        <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-blue-600 text-xs font-medium">
          Credit Trend
        </span>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 8 }}>
          <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="week"
            tick={({ x, y, payload }) => {
              const item = chartData.find((entry) => entry.week === payload.value);
              const monthLabel = item?.month ? item.month : "";
              return (
                <g transform={`translate(${x},${y})`}>
                  <text x={0} y={0} dy={16} textAnchor="middle" fill="#64748b" fontSize={11} fontWeight={600}>
                    {payload.value}
                  </text>
                  {monthLabel ? (
                    <text x={0} y={20} dy={16} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight={600}>
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
            tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
            tickFormatter={(value) => `Rs.${value / 1000}k`}
          />
          <Tooltip
            formatter={(value) => [`Rs. ${value.toLocaleString()}`, "Credit"]}
            contentStyle={{ borderRadius: 16, borderColor: "#f1f5f9", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }}
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