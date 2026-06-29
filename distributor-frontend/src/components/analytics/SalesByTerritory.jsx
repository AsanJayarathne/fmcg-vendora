import AnalyticsCard from "./AnalyticsCard";

export default function SalesByTerritory({ data }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <AnalyticsCard title="Sales by Territory">
      <div className="space-y-5">
        {data.map((item) => (
          <div key={item.name} className="grid items-center grid-cols-5 gap-4">
            <p className="text-sm font-medium text-gray-700">{item.name}</p>

            <div className="h-4 col-span-3 bg-gray-100 rounded-full">
              <div
                className="h-4 bg-blue-600 rounded-full"
                style={{ width: `${(item.value / max) * 100}%` }}
              ></div>
            </div>

            <p className="text-xs text-gray-600">
              LKR {item.value}M ({item.percentage})
            </p>
          </div>
        ))}
      </div>
    </AnalyticsCard>
  );
}