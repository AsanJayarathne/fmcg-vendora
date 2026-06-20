import AnalyticsCard from "./AnalyticsCard";

export default function OrderStatusBreakdown({ data, totalOrders }) {
  return (
    <AnalyticsCard title="Order Status Breakdown">
      <div className="flex items-center gap-8">
        <div className="flex items-center justify-center w-32 h-32 border-[18px] border-green-500 rounded-full">
          <div className="text-center">
            <h3 className="text-xl font-bold">{totalOrders}</h3>
            <p className="text-xs text-gray-500">Total Orders</p>
          </div>
        </div>

        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
              <p className="w-24 text-sm">{item.label}</p>
              <p className="text-sm font-bold">{item.value}%</p>
            </div>
          ))}
        </div>
      </div>

      <button className="mt-4 text-sm font-semibold text-blue-600">
        View all orders →
      </button>
    </AnalyticsCard>
  );
}