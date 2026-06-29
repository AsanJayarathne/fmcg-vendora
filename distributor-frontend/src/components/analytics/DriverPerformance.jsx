import AnalyticsCard from "./AnalyticsCard";

export default function DriverPerformance({ drivers }) {
  const max = Math.max(...drivers.map((d) => d.deliveries));

  return (
    <AnalyticsCard
      title="Driver Performance"
      action={<button className="text-xs font-semibold text-blue-600">View All</button>}
    >
      <div className="space-y-4">
        {drivers.map((driver) => (
          <div key={driver.name} className="grid items-center grid-cols-4 gap-3">
            <p className="text-sm">{driver.name}</p>

            <div className="h-2 col-span-2 bg-gray-100 rounded-full">
              <div
                className="h-2 bg-green-500 rounded-full"
                style={{ width: `${(driver.deliveries / max) * 100}%` }}
              ></div>
            </div>

            <p className="text-sm font-semibold">{driver.deliveries}</p>
          </div>
        ))}
      </div>
    </AnalyticsCard>
  );
}