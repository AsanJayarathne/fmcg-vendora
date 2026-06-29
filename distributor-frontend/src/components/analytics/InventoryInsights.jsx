export default function InventoryInsights({ insights }) {
  return (
    <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
      <h2 className="mb-4 text-base font-bold text-gray-900">
        Inventory Insights
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {insights.map((item) => (
          <div
            key={item.title}
            className="p-5 border border-gray-100 rounded-xl bg-gray-50"
          >
            <p className="text-sm text-gray-600">{item.title}</p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">
              {item.value}
            </h3>
            <p className="mt-2 text-xs text-gray-500">{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}