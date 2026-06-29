import AnalyticsCard from "./AnalyticsCard";

export default function SalesOverview({ data }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <AnalyticsCard title="Sales Overview">
      <div className="h-64">
        <div className="flex items-end gap-6 border-b h-52">
          {data.map((item) => (
            <div key={item.label} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-blue-500 rounded-t-lg max-w-8"
                style={{ height: `${(item.value / max) * 180}px` }}
              ></div>
              <p className="mt-2 text-xs text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </AnalyticsCard>
  );
}