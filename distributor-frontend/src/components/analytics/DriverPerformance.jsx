import AnalyticsCard from "./AnalyticsCard";
import { Truck } from "lucide-react";

export default function DriverPerformance({ drivers }) {
  const list = drivers || [];
  const max = Math.max(...list.map((d) => d.deliveries), 1);

  return (
    <AnalyticsCard
      title="Driver Performance"
      subtitle="Completed order deliveries by driver"
      icon={Truck}
    >
      <div className="space-y-4 py-1">
        {list.map((driver) => (
          <div key={driver.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">{driver.name}</span>
              <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-lg">
                {driver.deliveries} deliveries
              </span>
            </div>

            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(driver.deliveries / max) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </AnalyticsCard>
  );
}