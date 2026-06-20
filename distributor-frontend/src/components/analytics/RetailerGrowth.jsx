import AnalyticsCard from "./AnalyticsCard";

export default function RetailerGrowth({ data }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <AnalyticsCard title="Retailer Growth">
      <div className="flex items-end h-48 gap-5 border-b">
        {data.map((item) => (
          <div key={item.month} className="flex flex-col items-center flex-1">
            <p className="mb-1 text-xs font-bold text-purple-600">
              {item.value}
            </p>

            <div
              className="w-full bg-purple-500 rounded-t-lg max-w-8"
              style={{ height: `${(item.value / max) * 150}px` }}
            ></div>

            <p className="mt-2 text-xs text-gray-500">{item.month}</p>
          </div>
        ))}
      </div>
    </AnalyticsCard>
  );
}